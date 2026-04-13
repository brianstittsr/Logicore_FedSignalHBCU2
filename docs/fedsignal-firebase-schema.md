# FedSignal Firebase Firestore Schema

## Overview
This document defines the Firestore database schema for all FedSignal pages. Each module follows a **List/Detail pattern** with filtering, sorting, and click-through navigation.

---

## Collection Structure

```
/fedsignal
  ├── opportunities/{opportunityId}
  ├── grants/{grantId}
  ├── contracts/{contractId}
  ├── alerts/{alertId}
  ├── capabilities/{capabilityId}
  ├── teaming_partners/{partnerId}
  ├── sbir_awards/{awardId}
  ├── consortiums/{consortiumId}
  ├── rfis/{rfiId}
  ├── proposals/{proposalId}
  ├── subcontracts/{subcontractId}
  ├── scorecards/{scorecardId}
  ├── win_loss/{recordId}
  ├── fanda_records/{recordId}
  ├── gammadeck_cards/{cardId}
  ├── directory_entries/{entryId}
  ├── events/{eventId}
  ├── tasks/{taskId}
  ├── contacts/{contactId}
  ├── newsletters/{newsletterId}
  ├── content_assets/{assetId}
  ├── capvault_docs/{docId}
  ├── leadership_profiles/{profileId}
  ├── board_members/{memberId}
  ├── marketplace_listings/{listingId}
  ├── onboarding_flows/{flowId}
  └── invites/{inviteId}
```

---

## Core Collection Schemas

### 1. Opportunities (`opportunities`)
Federal contracting opportunities (SAM.gov, FedBizOpps).

**List View Fields:**
- `title` (string) - Opportunity title
- `agency` (string) - Agency name
- `naics_codes` (array) - NAICS codes
- `set_aside` (string) - SB, WOSB, 8(a), HUBZone, etc.
- `response_deadline` (timestamp) - Due date
- `contract_value` (number) - Estimated value
- `status` (enum: draft|published|closed|awarded)
- `opportunity_type` (enum: rfp|rfq|rfi|sources_sought)
- `created_at`, `updated_at` (timestamps)
- `university_id` (string) - HBCU assignment
- `match_score` (number) - AI match score

**Detail Fields:**
- `solicitation_number` (string)
- `description` (text)
- `requirements` (array of objects)
- `attachments` (array of URLs)
- `contact_info` (object)
- `similar_awards` (array of references)
- `teaming_suggestions` (array)
- `proposal_draft` (reference to proposals)
- `activity_log` (subcollection)

**Indexes:**
- `status` + `response_deadline`
- `agency` + `set_aside`
- `university_id` + `match_score`

---

### 2. Grants (`grants`)
Federal and private grant opportunities.

**List View Fields:**
- `title` (string)
- `funding_agency` (string)
- `grant_type` (enum: federal|private|foundation|corporate)
- `award_ceiling` (number)
- `award_floor` (number)
- `deadline` (timestamp)
- `eligibility` (array)
- `status` (enum: open|closed|awarded|pending)
- `created_at`, `updated_at`
- `university_id`
- `match_score`

**Detail Fields:**
- `funding_opportunity_number` (string)
- `cfda_number` (string)
- `synopsis` (text)
- `expected_awards` (number)
- `project_period` (string)
- `required_cost_share` (boolean)
- `application_url` (string)
- `documents` (array)
- `similar_grants` (array)
- `application_draft` (reference)

**Indexes:**
- `status` + `deadline`
- `funding_agency` + `grant_type`
- `eligibility` (array contains)

---

### 3. SBIR Awards (`sbir_awards`)
Small Business Innovation Research awards database.

**List View Fields:**
- `company_name` (string)
- `award_title` (string)
- `agency` (string)
- `topic_code` (string)
- `award_amount` (number)
- `award_date` (timestamp)
- `phase` (enum: I|II|III)
- `topic_title` (string)
- `created_at`, `updated_at`

**Detail Fields:**
- `contract_number` (string)
- `principal_investigator` (object)
- `research_institution` (string)
- `abstract` (text)
- `keywords` (array)
- `similar_technologies` (array)
- `related_opportunities` (array of references)

---

### 4. Alerts (`alerts`)
Real-time notifications and opportunity alerts.

**List View Fields:**
- `title` (string)
- `alert_type` (enum: opportunity|deadline|news|system)
- `priority` (enum: high|medium|low)
- `source` (string)
- `publish_date` (timestamp)
- `expires_at` (timestamp)
- `is_read` (boolean)
- `university_id` (string)
- `user_id` (string)
- `created_at`

**Detail Fields:**
- `description` (text)
- `action_url` (string)
- `action_text` (string)
- `related_entity_type` (string)
- `related_entity_id` (string)
- `metadata` (object)

**Indexes:**
- `user_id` + `is_read` + `created_at`
- `university_id` + `alert_type` + `priority`

---

### 5. Capabilities (`capabilities`)
HBCU research and technical capabilities catalog.

**List View Fields:**
- `capability_name` (string)
- `university_id` (string)
- `department` (string)
- `naics_codes` (array)
- `keywords` (array)
- `capability_type` (enum: research|technical|manufacturing|service)
- `availability_status` (enum: available|limited|unavailable)
- `match_score` (number)
- `created_at`, `updated_at`

**Detail Fields:**
- `description` (text)
- `equipment_list` (array)
- `certifications` (array)
- `past_performance` (array of references)
- `key_personnel` (array of objects)
- `facilities` (array)
- `related_opportunities` (array)
- `teaming_history` (array)

---

### 6. Teaming Partners (`teaming_partners`)
Potential and existing teaming partners.

**List View Fields:**
- `company_name` (string)
- `company_type` (enum: large|small|nonprofit|academic)
- `primary_naics` (string)
- `set_asides` (array)
- `location` (string)
- `contract_history_count` (number)
- `relationship_status` (enum: prospect|partner|preferred|past)
- `match_score` (number)
- `created_at`, `updated_at`

**Detail Fields:**
- `contact_info` (object)
- `website` (string)
- `duns` (string)
- `cage_code` (string)
- `past_contracts` (array)
- `capabilities` (array)
- `contract_history` (subcollection)
- `communications` (subcollection)
- `notes` (text)

---

### 7. Consortiums (`consortiums`)
Research and contracting consortium memberships.

**List View Fields:**
- `consortium_name` (string)
- `lead_university` (string)
- `member_count` (number)
- `focus_areas` (array)
- `status` (enum: forming|active|inactive)
- `next_meeting_date` (timestamp)
- `created_at`, `updated_at`

**Detail Fields:**
- `description` (text)
- `charter_url` (string)
- `member_universities` (array)
- `member_companies` (array)
- `ongoing_projects` (array)
- `funding_awarded` (number)
- `meeting_schedule` (array)
- `documents` (array)

---

### 8. RFIs (`rfis`)
Request for Information responses and tracking.

**List View Fields:**
- `rfi_title` (string)
- `agency` (string)
- `rfi_number` (string)
- `response_deadline` (timestamp)
- `status` (enum: draft|submitted|awarded|closed)
- `assigned_university` (string)
- `created_at`, `updated_at`

**Detail Fields:**
- `description` (text)
- `questions` (array of objects)
- `response_draft` (text)
- `attachments` (array)
- `submitted_by` (object)
- `submission_date` (timestamp)
- `agency_response` (text)
- `follow_up_opportunities` (array)

---

### 9. Proposals (`proposals`)
Proposal development and submission tracking.

**List View Fields:**
- `proposal_title` (string)
- `opportunity_reference` (reference)
- `grant_reference` (reference)
- `university_id` (string)
- `proposal_type` (enum: contract|grant|cooperative)
- `status` (enum: drafting|review|submitted|awarded|declined)
- `submission_deadline` (timestamp)
- `requested_amount` (number)
- `completion_percentage` (number)
- `created_at`, `updated_at`

**Detail Fields:**
- `narrative_sections` (array of objects)
- `budget` (object with line items)
- `team_members` (array)
- `subcontractors` (array)
- `attachments` (array)
- `review_checklist` (object)
- `submission_package` (array)
- `award_decision` (object)
- `debrief_notes` (text)
- `versions` (subcollection)

---

### 10. Subcontracts (`subcontracts`)
Subcontract and teaming agreement management.

**List View Fields:**
- `subcontract_title` (string)
- `prime_contractor` (reference to partners)
- `university_id` (string)
- `contract_value` (number)
- `status` (enum: negotiating|active|completed|disputed)
- `start_date`, `end_date` (timestamps)
- `created_at`, `updated_at`

**Detail Fields:**
- `prime_contract_number` (string)
- `scope_of_work` (text)
- `payment_terms` (string)
- `teaming_agreement_url` (string)
- `subcontract_agreement_url` (string)
- `invoices` (subcollection)
- `deliverables` (subcollection)
- `communications` (subcollection)
- `compliance_docs` (array)

---

### 11. Scorecards (`scorecards`)
Proposal and opportunity scorecards.

**List View Fields:**
- `scorecard_name` (string)
- `entity_type` (enum: opportunity|proposal|partner)
- `entity_id` (string)
- `entity_name` (string)
- `total_score` (number)
- `scored_by` (string)
- `scored_at` (timestamp)
- `university_id` (string)
- `created_at`

**Detail Fields:**
- `criteria` (array of objects with weights and scores)
  - `name`, `weight`, `score`, `max_score`, `notes`
- `recommendation` (enum: pursue|pass|monitor)
- `confidence_level` (enum: high|medium|low)
- `resources_required` (object)
- `competitive_analysis` (text)
- `risk_assessment` (text)
- `next_steps` (array)

---

### 12. Win/Loss Records (`win_loss`)
Win/Loss analysis and lessons learned.

**List View Fields:**
- `opportunity_name` (string)
- `opportunity_reference` (reference)
- `outcome` (enum: win|loss|no_bid|pending)
- `award_amount` (number)
- `award_date` (timestamp)
- `competitor_count` (number)
- `university_id` (string)
- `analyzed` (boolean)
- `created_at`, `updated_at`

**Detail Fields:**
- `proposal_reference` (reference)
- `winner_info` (object)
- `our_proposal_summary` (text)
- `debrief_notes` (text)
- `win_factors` (array)
- `loss_factors` (array)
- `lessons_learned` (text)
- `improvement_actions` (array)
- `competitor_proposals` (array)

---

### 13. Facilities & Assets (`fanda_records`)
F&A rate tracking and management.

**List View Fields:**
- `university_id` (string)
- `fiscal_year` (string)
- `rate_type` (enum: on_campus|off_campus|other)
- `negotiated_rate` (number)
- `provisional_rate` (number)
- `effective_date` (timestamp)
- `status` (enum: proposed|negotiating|approved|expired)
- `created_at`, `updated_at`

**Detail Fields:**
- `rate_base` (number)
- `cost_pool_breakdown` (object)
- `negotiation_history` (array)
- `cognizant_agency` (string)
- `award_range` (string)
- `supporting_documents` (array)
- `expiration_date` (timestamp)
- `renewal_status` (string)

---

### 14. GammaDeck Cards (`gammadeck_cards`)
Capture management cards and pipeline.

**List View Fields:**
- `card_title` (string)
- `opportunity_reference` (reference)
- `stage` (enum: identification|qualification|capture|proposal|award)
- `probability` (number)
- `expected_value` (number)
- `expected_award_date` (timestamp)
- `assigned_to` (string)
- `university_id` (string)
- `created_at`, `updated_at`

**Detail Fields:**
- `customer_profile` (object)
- `competitive_landscape` (text)
- `win_strategy` (text)
- `gate_reviews` (array)
- `action_items` (array)
- `team_members` (array)
- `documents` (array)
- `communications` (subcollection)

---

### 15. Directory (`directory_entries`)
HBCU contracting office directory.

**List View Fields:**
- `university_name` (string)
- `university_id` (string)
- `location` (string)
- `contact_name` (string)
- `title` (string)
- `email` (string)
- `phone` (string)
- `primary_naics` (array)
- `certifications` (array)
- `created_at`, `updated_at`

**Detail Fields:**
- `contracting_office` (object)
- `research_focus_areas` (array)
- `capabilities_summary` (text)
- `past_awards` (array)
- `teaming_preferences` (array)
- `preferred_partners` (array)
- `documents` (array)
- `notes` (text)

---

### 16. Events (`events`)
Calendar events and meetings.

**List View Fields:**
- `title` (string)
- `event_type` (enum: deadline|meeting|conference|milestone|reminder)
- `start_time` (timestamp)
- `end_time` (timestamp)
- `all_day` (boolean)
- `related_entity_type` (string)
- `related_entity_id` (string)
- `university_id` (string)
- `created_at`, `updated_at`

**Detail Fields:**
- `description` (text)
- `location` (string)
- `virtual_link` (string)
- `attendees` (array of objects)
- `attachments` (array)
- `reminders` (array)
- `recurring_rule` (object)
- `notes` (text)

**Indexes:**
- `university_id` + `start_time`
- `event_type` + `start_time`

---

### 17. Tasks (`tasks`)
Action items and task management.

**List View Fields:**
- `title` (string)
- `assigned_to` (string)
- `due_date` (timestamp)
- `priority` (enum: high|medium|low)
- `status` (enum: open|in_progress|completed|cancelled)
- `related_entity_type` (string)
- `related_entity_id` (string)
- `university_id` (string)
- `created_at`, `updated_at`

**Detail Fields:**
- `description` (text)
- `checklist` (array)
- `attachments` (array)
- `comments` (subcollection)
- `time_entries` (array)
- `completed_at` (timestamp)
- `completed_by` (string)

---

### 18. Contacts (`contacts`)
CRM contact management.

**List View Fields:**
- `first_name`, `last_name` (strings)
- `full_name` (string)
- `organization` (string)
- `title` (string)
- `email` (string)
- `phone` (string)
- `contact_type` (enum: government|industry|academic|partner)
- `university_id` (string)
- `last_contact_date` (timestamp)
- `created_at`, `updated_at`

**Detail Fields:**
- `address` (object)
- `social_profiles` (object)
- `notes` (text)
- `tags` (array)
- `interactions` (subcollection)
- `opportunities` (array of references)
- `warmth` (enum: cold|warm|hot)

---

### 19. Newsletters (`newsletters`)
Newsletter management and distribution.

**List View Fields:**
- `newsletter_name` (string)
- `issue_number` (string)
- `publish_date` (timestamp)
- `status` (enum: draft|scheduled|published|archived)
- `recipient_count` (number)
- `open_rate` (number)
- `click_rate` (number)
- `university_id` (string)
- `created_at`, `updated_at`

**Detail Fields:**
- `subject_line` (string)
- `preheader_text` (string)
- `content_blocks` (array)
- `featured_opportunities` (array)
- `featured_news` (array)
- `recipients` (array or subcollection)
- `analytics` (object)

---

### 20. Content Assets (`content_assets`)
Content studio asset library.

**List View Fields:**
- `asset_name` (string)
- `asset_type` (enum: image|video|document|template|graphic)
- `file_url` (string)
- `thumbnail_url` (string)
- `tags` (array)
- `usage_count` (number)
- `university_id` (string)
- `created_at`, `updated_at`

**Detail Fields:**
- `description` (text)
- `file_size` (number)
- `dimensions` (object for images)
- `duration` (number for videos)
- `metadata` (object)
- `versions` (array)
- `usage_history` (array)

---

### 21. CAPVault Documents (`capvault_docs`)
Capability documents and past performance.

**List View Fields:**
- `document_name` (string)
- `document_type` (enum: capability|past_performance|technical|financial)
- `file_url` (string)
- `expiration_date` (timestamp)
- `status` (enum: current|expiring|expired)
- `university_id` (string)
- `created_at`, `updated_at`

**Detail Fields:**
- `description` (text)
- `contract_number` (string)
- `contract_value` (number)
- `performance_period` (object)
- `customer_info` (object)
- `keywords` (array)
- `related_opportunities` (array)
- `renewal_reminder_sent` (boolean)

---

### 22. Leadership Profiles (`leadership_profiles`)
HBCU leadership and key personnel.

**List View Fields:**
- `full_name` (string)
- `title` (string)
- `university_id` (string)
- `department` (string)
- `expertise_areas` (array)
- `certifications` (array)
- `clearance_level` (string)
- `available_for_teaming` (boolean)
- `created_at`, `updated_at`

**Detail Fields:**
- `bio` (text)
- `photo_url` (string)
- `education` (array)
- `publications` (array)
- `past_projects` (array)
- `contact_info` (object)
- `resume_url` (string)
- `proposals_led` (array)

---

### 23. Board Members (`board_members`)
Advisory board and governance.

**List View Fields:**
- `full_name` (string)
- `organization` (string)
- `role` (enum: member|chair|advisor|observer)
- `expertise_areas` (array)
- `term_start`, `term_end` (timestamps)
- `status` (enum: active|inactive|emeritus)
- `created_at`, `updated_at`

**Detail Fields:**
- `bio` (text)
- `photo_url` (string)
- `contact_info` (object)
- `committees` (array)
- `meetings_attended` (array)
- `contributions` (array)
- `conflicts_of_interest` (array)

---

### 24. Marketplace Listings (`marketplace_listings`)
Service and capability marketplace.

**List View Fields:**
- `listing_title` (string)
- `provider_university` (string)
- `service_category` (string)
- `price_range` (string)
- `availability` (enum: available|limited|booked)
- `rating` (number)
- `review_count` (number)
- `created_at`, `updated_at`

**Detail Fields:**
- `description` (text)
- `service_details` (array)
- `portfolio` (array)
- `pricing_tiers` (array)
- `requirements` (array)
- `delivery_timeline` (string)
- `reviews` (subcollection)
- `inquiries` (subcollection)

---

### 25. Onboarding Flows (`onboarding_flows`)
User onboarding sequences.

**List View Fields:**
- `flow_name` (string)
- `target_audience` (enum: faculty|admin|researcher|student)
- `step_count` (number)
- `completion_rate` (number)
- `status` (enum: active|draft|archived)
- `created_at`, `updated_at`

**Detail Fields:**
- `description` (text)
- `steps` (array of objects)
  - `order`, `title`, `content`, `action_type`, `action_url`
- `prerequisites` (array)
- `completion_actions` (array)
- `analytics` (object)

---

### 26. Invites (`invites`)
Invitation and referral management.

**List View Fields:**
- `invited_email` (string)
- `invited_name` (string)
- `inviter_name` (string)
- `university_id` (string)
- `invite_type` (enum: team|consortium|platform)
- `status` (enum: pending|accepted|declined|expired)
- `sent_at` (timestamp)
- `expires_at` (timestamp)
- `created_at`

**Detail Fields:**
- `custom_message` (text)
- `invite_code` (string)
- `accepted_at` (timestamp)
- `declined_reason` (text)
- `reminders_sent` (number)
- `invite_url` (string)

---

## Common Patterns

### List/Detail Page Structure

Every collection follows this pattern:

**List Page (`/fedsignal/{collection}`):**
- Search bar (text search across name/title/description)
- Filter sidebar (status, type, date range, tags)
- Sort options (newest, alphabetical, value, deadline)
- Pagination or infinite scroll
- Card/Table view toggle
- Export to CSV

**Detail Page (`/fedsignal/{collection}/{id}`):**
- Header with title, status badge, actions
- Tab navigation (Overview, Details, Activity, Documents)
- Related entities sidebar
- Action buttons (Edit, Delete, Archive)
- Activity feed
- Version history

### Standard Fields (All Collections)

```typescript
interface BaseDocument {
  id: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: string; // userId
  updated_by: string; // userId
  university_id: string;
  organization_id: string;
  is_archived: boolean;
  archived_at: Timestamp | null;
  archived_by: string | null;
  tags: string[];
  metadata: Record<string, any>;
}
```

### Security Rules Pattern

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user belongs to university
    function belongsTo(universityId) {
      return request.auth != null && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.university_id == universityId;
    }
    
    // Helper to check if admin
    function isAdmin() {
      return request.auth != null && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /fedsignal/{collection}/{docId} {
      allow read: if belongsTo(resource.data.university_id) || isAdmin();
      allow create: if belongsTo(request.resource.data.university_id) || isAdmin();
      allow update, delete: if belongsTo(resource.data.university_id) || isAdmin();
    }
  }
}
```

---

## Implementation Notes

### Frontend Data Fetching Pattern

```typescript
// List page query with filters
const opportunitiesQuery = query(
  collection(db, 'fedsignal/opportunities'),
  where('university_id', '==', currentUniversityId),
  where('status', '==', 'open'),
  orderBy('response_deadline', 'asc'),
  limit(25)
);

// Detail page with related data
const opportunityRef = doc(db, 'fedsignal/opportunities', id);
const activityQuery = query(
  collection(db, `fedsignal/opportunities/${id}/activity_log`),
  orderBy('timestamp', 'desc')
);
```

### Composite Indexes Required

Create these in `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "opportunities",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "university_id", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "response_deadline", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "grants",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "university_id", "order": "ASCENDING" },
        { "fieldPath": "eligibility", "arrayConfig": "CONTAINS" },
        { "fieldPath": "deadline", "order": "ASCENDING" }
      ]
    }
  ]
}
```

---

## Summary

This schema provides:
- ✅ **26 collections** covering all FedSignal modules
- ✅ **List/Detail pattern** with consistent filtering and navigation
- ✅ **Multi-tenant security** via `university_id` field
- ✅ **Full-text search support** via Algolia/Typesense integration
- ✅ **Activity logging** for audit trails
- ✅ **Document versioning** for proposals and assets
- ✅ **Scalable indexing** for performance
