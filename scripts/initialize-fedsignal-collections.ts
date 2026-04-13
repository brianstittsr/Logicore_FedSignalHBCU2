/**
 * Initialize FedSignal Firestore Collections
 * 
 * This script creates initial placeholder documents in each FedSignal collection
 * to ensure they exist in Firestore with proper structure.
 * 
 * Usage: npx ts-node scripts/initialize-fedsignal-collections.ts
 */

import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';

// Firebase configuration - uses existing project
const firebaseConfig = {
  // These will be loaded from environment variables
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (only if not already initialized)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Collections to initialize
const FEDSIGNAL_COLLECTIONS = [
  // Core collections
  { name: 'fedsignal_opportunities', template: createOpportunityTemplate },
  { name: 'fedsignal_grants', template: createGrantTemplate },
  { name: 'fedsignal_sbir_awards', template: createSbirAwardTemplate },
  { name: 'fedsignal_alerts', template: createAlertTemplate },
  { name: 'fedsignal_capabilities', template: createCapabilityTemplate },
  { name: 'fedsignal_teaming_partners', template: createTeamingPartnerTemplate },
  { name: 'fedsignal_consortiums', template: createConsortiumTemplate },
  { name: 'fedsignal_rfis', template: createRfiTemplate },
  { name: 'fedsignal_proposals', template: createProposalTemplate },
  { name: 'fedsignal_subcontracts', template: createSubcontractTemplate },
  { name: 'fedsignal_scorecards', template: createScorecardTemplate },
  { name: 'fedsignal_win_loss', template: createWinLossTemplate },
  { name: 'fedsignal_fanda_records', template: createFandaRecordTemplate },
  { name: 'fedsignal_gammadeck_cards', template: createGammadeckCardTemplate },
  { name: 'fedsignal_directory_entries', template: createDirectoryEntryTemplate },
  { name: 'fedsignal_events', template: createEventTemplate },
  { name: 'fedsignal_tasks', template: createTaskTemplate },
  { name: 'fedsignal_contacts', template: createContactTemplate },
  { name: 'fedsignal_newsletters', template: createNewsletterTemplate },
  { name: 'fedsignal_content_assets', template: createContentAssetTemplate },
  { name: 'fedsignal_capvault_docs', template: createCapvaultDocTemplate },
  { name: 'fedsignal_leadership_profiles', template: createLeadershipProfileTemplate },
  { name: 'fedsignal_board_members', template: createBoardMemberTemplate },
  { name: 'fedsignal_marketplace_listings', template: createMarketplaceListingTemplate },
  { name: 'fedsignal_onboarding_flows', template: createOnboardingFlowTemplate },
  { name: 'fedsignal_invites', template: createInviteTemplate },
  { name: 'fedsignal_contracts', template: createContractTemplate },
];

// Template creators
function createOpportunityTemplate() {
  return {
    title: 'Sample Federal Opportunity',
    agency: 'Department of Defense',
    naics_codes: ['541330', '541715'],
    set_aside: 'SB',
    response_deadline: serverTimestamp(),
    contract_value: 500000,
    status: 'draft',
    opportunity_type: 'rfp',
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
    university_id: 'tuskegee',
    match_score: 85,
    created_by: 'system',
  };
}

function createGrantTemplate() {
  return {
    title: 'Sample Research Grant',
    funding_agency: 'National Science Foundation',
    grant_type: 'federal',
    award_ceiling: 1000000,
    award_floor: 500000,
    deadline: serverTimestamp(),
    eligibility: ['HBCU', 'MSI'],
    status: 'open',
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
    university_id: 'tuskegee',
    match_score: 90,
  };
}

function createSbirAwardTemplate() {
  return {
    company_name: 'Sample SBIR Company',
    award_title: 'Advanced Research Project',
    agency: 'DARPA',
    topic_code: 'SB172-001',
    award_amount: 150000,
    award_date: serverTimestamp(),
    phase: 'I',
    topic_title: 'AI for Defense Applications',
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
}

function createAlertTemplate() {
  return {
    title: 'Welcome to FedSignal',
    alert_type: 'system',
    priority: 'medium',
    source: 'FedSignal Platform',
    publish_date: serverTimestamp(),
    is_read: false,
    university_id: 'tuskegee',
    user_id: 'system',
    created_at: serverTimestamp(),
  };
}

function createCapabilityTemplate() {
  return {
    capability_name: 'AI/ML Research',
    university_id: 'tuskegee',
    department: 'Computer Science',
    naics_codes: ['541715'],
    keywords: ['AI', 'Machine Learning', 'Data Science'],
    capability_type: 'research',
    availability_status: 'available',
    match_score: 95,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
}

function createTeamingPartnerTemplate() {
  return {
    company_name: 'Sample Defense Contractor',
    company_type: 'large',
    primary_naics: '541330',
    set_asides: ['SB', 'WOSB'],
    location: 'Washington, DC',
    contract_history_count: 25,
    relationship_status: 'prospect',
    match_score: 75,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
}

function createConsortiumTemplate() {
  return {
    consortium_name: 'HBCU Research Alliance',
    lead_university: 'Tuskegee University',
    member_count: 5,
    focus_areas: ['STEM', 'Defense', 'Cybersecurity'],
    status: 'active',
    next_meeting_date: serverTimestamp(),
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
}

function createRfiTemplate() {
  return {
    rfi_title: 'Sources Sought: Cloud Services',
    agency: 'General Services Administration',
    rfi_number: 'RFI-GSA-2024-001',
    response_deadline: serverTimestamp(),
    status: 'draft',
    assigned_university: 'tuskegee',
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
}

function createProposalTemplate() {
  return {
    proposal_title: 'Sample Proposal',
    proposal_type: 'contract',
    status: 'drafting',
    submission_deadline: serverTimestamp(),
    requested_amount: 750000,
    completion_percentage: 25,
    university_id: 'tuskegee',
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
}

function createSubcontractTemplate() {
  return {
    subcontract_title: 'Sample Subcontract',
    prime_contractor: 'Lockheed Martin',
    university_id: 'tuskegee',
    contract_value: 250000,
    status: 'negotiating',
    start_date: serverTimestamp(),
    end_date: serverTimestamp(),
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
}

function createScorecardTemplate() {
  return {
    scorecard_name: 'Opportunity Evaluation',
    entity_type: 'opportunity',
    entity_id: 'sample-id',
    entity_name: 'Sample Opportunity',
    total_score: 85,
    scored_by: 'system',
    scored_at: serverTimestamp(),
    university_id: 'tuskegee',
    created_at: serverTimestamp(),
  };
}

function createWinLossTemplate() {
  return {
    opportunity_name: 'Sample RFP',
    outcome: 'pending',
    award_amount: 0,
    university_id: 'tuskegee',
    analyzed: false,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
}

function createFandaRecordTemplate() {
  return {
    university_id: 'tuskegee',
    fiscal_year: '2024',
    rate_type: 'on_campus',
    negotiated_rate: 56.5,
    provisional_rate: 56.5,
    effective_date: serverTimestamp(),
    status: 'approved',
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
}

function createGammadeckCardTemplate() {
  return {
    card_title: 'Capture Opportunity',
    stage: 'identification',
    probability: 30,
    expected_value: 1000000,
    expected_award_date: serverTimestamp(),
    assigned_to: 'system',
    university_id: 'tuskegee',
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
}

function createDirectoryEntryTemplate() {
  return {
    university_name: 'Tuskegee University',
    university_id: 'tuskegee',
    location: 'Tuskegee, AL',
    contact_name: 'John Doe',
    title: 'Director of Research',
    email: 'research@tuskegee.edu',
    phone: '(334) 555-0123',
    primary_naics: ['541330', '541715'],
    certifications: ['ISO 9001', 'CMMI Level 3'],
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
}

function createEventTemplate() {
  return {
    title: 'FedSignal Training Webinar',
    event_type: 'meeting',
    start_time: serverTimestamp(),
    end_time: serverTimestamp(),
    all_day: false,
    university_id: 'tuskegee',
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
}

function createTaskTemplate() {
  return {
    title: 'Review Opportunity',
    assigned_to: 'system',
    due_date: serverTimestamp(),
    priority: 'medium',
    status: 'open',
    university_id: 'tuskegee',
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
}

function createContactTemplate() {
  return {
    first_name: 'Jane',
    last_name: 'Smith',
    full_name: 'Jane Smith',
    organization: 'Department of Defense',
    title: 'Contracting Officer',
    email: 'jane.smith@defense.gov',
    phone: '(202) 555-0123',
    contact_type: 'government',
    university_id: 'tuskegee',
    last_contact_date: serverTimestamp(),
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
}

function createNewsletterTemplate() {
  return {
    newsletter_name: 'FedSignal Weekly',
    issue_number: '001',
    publish_date: serverTimestamp(),
    status: 'draft',
    recipient_count: 0,
    open_rate: 0,
    click_rate: 0,
    university_id: 'tuskegee',
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
}

function createContentAssetTemplate() {
  return {
    asset_name: 'Sample Capability Brief',
    asset_type: 'document',
    file_url: '',
    thumbnail_url: '',
    tags: ['capability', 'brief'],
    usage_count: 0,
    university_id: 'tuskegee',
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
}

function createCapvaultDocTemplate() {
  return {
    document_name: 'Past Performance Summary',
    document_type: 'past_performance',
    file_url: '',
    expiration_date: serverTimestamp(),
    status: 'current',
    university_id: 'tuskegee',
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
}

function createLeadershipProfileTemplate() {
  return {
    full_name: 'Dr. Robert Johnson',
    title: 'Dean of Research',
    university_id: 'tuskegee',
    department: 'Research Office',
    expertise_areas: ['STEM', 'Research Administration'],
    certifications: ['CPEM', 'PMP'],
    clearance_level: 'Secret',
    available_for_teaming: true,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
}

function createBoardMemberTemplate() {
  return {
    full_name: 'Advisory Board Member',
    organization: 'Industry Partner Inc.',
    role: 'member',
    expertise_areas: ['Defense Contracting', 'Innovation'],
    term_start: serverTimestamp(),
    term_end: serverTimestamp(),
    status: 'active',
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
}

function createMarketplaceListingTemplate() {
  return {
    listing_title: 'Research Partnership Services',
    provider_university: 'tuskegee',
    service_category: 'Research Collaboration',
    price_range: '$50K - $500K',
    availability: 'available',
    rating: 5.0,
    review_count: 0,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
}

function createOnboardingFlowTemplate() {
  return {
    flow_name: 'New User Onboarding',
    target_audience: 'faculty',
    step_count: 5,
    completion_rate: 0,
    status: 'active',
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
}

function createInviteTemplate() {
  return {
    invited_email: 'user@example.com',
    invited_name: 'New User',
    inviter_name: 'System Admin',
    university_id: 'tuskegee',
    invite_type: 'platform',
    status: 'pending',
    sent_at: serverTimestamp(),
    expires_at: serverTimestamp(),
    created_at: serverTimestamp(),
  };
}

function createContractTemplate() {
  return {
    contract_number: 'Contract-001',
    contract_title: 'Sample Contract',
    prime_contractor: 'Lockheed Martin',
    university_id: 'tuskegee',
    contract_value: 500000,
    start_date: serverTimestamp(),
    end_date: serverTimestamp(),
    status: 'active',
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
}

// Main initialization function
async function initializeCollections() {
  console.log('🚀 Initializing FedSignal Firestore collections...\n');
  
  const batch = writeBatch(db);
  
  for (const { name, template } of FEDSIGNAL_COLLECTIONS) {
    try {
      const collRef = collection(db, name);
      const docRef = doc(collRef, '_init');
      
      batch.set(docRef, template());
      
      console.log(`✅ ${name}`);
    } catch (error) {
      console.error(`❌ ${name}:`, error);
    }
  }
  
  try {
    await batch.commit();
    console.log('\n✅ All collections initialized successfully!');
    console.log('\n📊 Collections created:');
    console.log(FEDSIGNAL_COLLECTIONS.map(c => `  • ${c.name}`).join('\n'));
  } catch (error) {
    console.error('\n❌ Error committing batch:', error);
    process.exit(1);
  }
}

// Run initialization
initializeCollections()
  .then(() => {
    console.log('\n🎉 FedSignal schema deployed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Deployment failed:', error);
    process.exit(1);
  });
