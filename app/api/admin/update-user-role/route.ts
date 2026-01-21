import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/schema";

export async function POST(request: NextRequest) {
  try {
    const { email, newRole } = await request.json();

    if (!email || !newRole) {
      return NextResponse.json(
        { error: "Email and newRole are required" },
        { status: 400 }
      );
    }

    if (!db) {
      return NextResponse.json(
        { error: "Database not initialized" },
        { status: 500 }
      );
    }

    // Update team_members collection
    const teamMembersRef = collection(db, COLLECTIONS.TEAM_MEMBERS);
    const teamQuery = query(teamMembersRef, where("emailPrimary", "==", email));
    const teamSnapshot = await getDocs(teamQuery);

    let teamMemberUpdated = false;
    for (const docSnap of teamSnapshot.docs) {
      await updateDoc(doc(db, COLLECTIONS.TEAM_MEMBERS, docSnap.id), {
        role: newRole,
      });
      teamMemberUpdated = true;
      console.log(`Updated team member ${docSnap.id} role to ${newRole}`);
    }

    // Also update users collection if exists
    const usersRef = collection(db, COLLECTIONS.USERS);
    const usersQuery = query(usersRef, where("email", "==", email));
    const usersSnapshot = await getDocs(usersQuery);

    let userUpdated = false;
    for (const docSnap of usersSnapshot.docs) {
      await updateDoc(doc(db, COLLECTIONS.USERS, docSnap.id), {
        role: newRole,
      });
      userUpdated = true;
      console.log(`Updated user ${docSnap.id} role to ${newRole}`);
    }

    if (!teamMemberUpdated && !userUpdated) {
      return NextResponse.json(
        { error: `No user found with email: ${email}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Role updated to ${newRole} for ${email}`,
      teamMemberUpdated,
      userUpdated,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
