import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/schema";
import { collection, getDocs, query, where, updateDoc, Timestamp, doc as firestoreDoc } from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json({ error: "email and role are required" }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let teamMemberUpdated = false;
    let userProfileUpdated = false;
    let teamMemberId = null;
    let firebaseUid = null;

    // Find the team member by emailPrimary
    let snapshot = await getDocs(
      query(collection(db, COLLECTIONS.TEAM_MEMBERS), where("emailPrimary", "==", normalizedEmail))
    );

    // If not found, try email field
    if (snapshot.empty) {
      snapshot = await getDocs(
        query(collection(db, COLLECTIONS.TEAM_MEMBERS), where("email", "==", normalizedEmail))
      );
    }

    if (!snapshot.empty) {
      const teamMemberDoc = snapshot.docs[0];
      teamMemberId = teamMemberDoc.id;
      const teamMemberData = teamMemberDoc.data();
      firebaseUid = teamMemberData.firebaseUid;
      
      // Update the Team Member role
      await updateDoc(teamMemberDoc.ref, {
        role: role,
        isAffiliate: role === "affiliate",
        updatedAt: Timestamp.now(),
      });
      teamMemberUpdated = true;
      console.log(`Updated Team Member ${teamMemberId} role to: ${role}`);
    }

    // Also update the User Profile if we have a firebaseUid
    if (firebaseUid) {
      const userProfileRef = firestoreDoc(db, COLLECTIONS.USERS, firebaseUid);
      await updateDoc(userProfileRef, {
        role: role,
        isAffiliate: role === "affiliate",
        updatedAt: Timestamp.now(),
      });
      userProfileUpdated = true;
      console.log(`Updated User Profile ${firebaseUid} role to: ${role}`);
    } else {
      // Try to find User Profile by email
      const userSnapshot = await getDocs(
        query(collection(db, COLLECTIONS.USERS), where("email", "==", normalizedEmail))
      );
      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        await updateDoc(userDoc.ref, {
          role: role,
          isAffiliate: role === "affiliate",
          updatedAt: Timestamp.now(),
        });
        userProfileUpdated = true;
        console.log(`Updated User Profile ${userDoc.id} role to: ${role}`);
      }
    }

    if (!teamMemberUpdated && !userProfileUpdated) {
      return NextResponse.json({ error: `No team member or user found with email: ${email}` }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${email} to role: ${role}`,
      teamMemberId,
      teamMemberUpdated,
      userProfileUpdated,
    });
  } catch (error) {
    console.error("Update role error:", error);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}
