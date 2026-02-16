import { NISTControl } from "@/lib/types/cmmc";

/**
 * NIST SP 800-171 Revision 3 Controls
 * Protecting Controlled Unclassified Information in Nonfederal Systems and Organizations
 * 
 * Organized by Control Families:
 * - AC: Access Control
 * - AT: Awareness and Training
 * - AU: Audit and Accountability
 * - CM: Configuration Management
 * - IA: Identification and Authentication
 * - IR: Incident Response
 * - MA: Maintenance
 * - MP: Media Protection
 * - PE: Physical Protection
 * - PS: Personnel Security
 * - RA: Risk Assessment
 * - CA: Security Assessment
 * - SC: System and Communications Protection
 * - SI: System and Information Integrity
 * - SA: System and Services Acquisition
 * - SR: Supply Chain Risk Management
 */

export const NIST_CONTROLS: NISTControl[] = [
  // ============================================
  // ACCESS CONTROL (AC)
  // ============================================
  {
    id: "AC.L1-3.1.1",
    family: "AC",
    level: 1,
    number: "3.1.1",
    title: "Limit System Access to Authorized Users",
    description: "Limit system access to authorized users, processes acting on behalf of authorized users, and devices (including other systems).",
    discussion: "This requirement addresses the need to limit access to systems that process, store, or transmit CUI. Access can be limited by physically securing the system in a controlled access area or by logical access controls. The intent is to ensure that only authorized users have access to organizational systems.",
    relatedControls: ["AC.L1-3.1.2", "IA.L1-3.5.1", "IA.L1-3.5.2"],
    assessmentObjective: "Determine if access to the system is limited to authorized users, processes acting on behalf of authorized users, and devices.",
    potentialAssessors: ["System Administrator", "Security Officer", "IT Manager"],
    cmmcLevel: 1,
    commonArtifacts: [
      "Access Control Policy",
      "User Access List/Roster",
      "System Configuration Baselines",
      "Network Diagram showing access points",
      "Logical access control configurations"
    ],
    interviewQuestions: [
      "Who has access to systems processing CUI?",
      "How is system access requested and approved?",
      "What processes prevent unauthorized access?",
      "How are terminated employees' access removed?"
    ],
    testMethods: ["examine", "interview"]
  },
  {
    id: "AC.L1-3.1.2",
    family: "AC",
    level: 1,
    number: "3.1.2",
    title: "Limit System Access to Types of Transactions and Functions",
    description: "Limit system access to the types of transactions and functions that authorized users are permitted to execute.",
    discussion: "This requirement restricts user access to only those transactions and functions necessary to accomplish assigned tasks. Organizations can implement this by using role-based access control (RBAC), attribute-based access control (ABAC), or access control lists (ACLs).",
    relatedControls: ["AC.L1-3.1.1", "AC.L2-3.1.4", "AC.L2-3.1.5"],
    assessmentObjective: "Determine if system access is limited to the types of transactions and functions that authorized users are permitted to execute.",
    potentialAssessors: ["System Administrator", "Application Owner", "Security Officer"],
    cmmcLevel: 1,
    commonArtifacts: [
      "Role-Based Access Control (RBAC) Matrix",
      "User Access Rights Documentation",
      "Application Security Settings",
      "Privilege Escalation Procedures",
      "User Permission Audits"
    ],
    interviewQuestions: [
      "How do you ensure users only have access to functions they need?",
      "What roles are defined in the system?",
      "How are privileged accounts managed?",
      "How often are user permissions reviewed?"
    ],
    testMethods: ["examine", "interview", "test"]
  },
  {
    id: "AC.L1-3.1.20",
    family: "AC",
    level: 1,
    number: "3.1.20",
    title: "Encrypt CUI on Mobile Devices",
    description: "Encrypt CUI on mobile devices and mobile computing platforms.",
    discussion: "Mobile devices include laptops, tablets, and smartphones. Mobile computing platforms include systems that provide software-based emulation of mobile systems. Encryption protects CUI in the event mobile devices are lost or stolen.",
    relatedControls: ["SC.L1-3.13.11", "MP.L1-3.8.6"],
    assessmentObjective: "Determine if CUI on mobile devices and mobile computing platforms is encrypted.",
    potentialAssessors: ["IT Administrator", "Security Officer", "Endpoint Manager"],
    cmmcLevel: 1,
    commonArtifacts: [
      "Mobile Device Encryption Policy",
      "BitLocker/FileVault Configuration Reports",
      "MDM (Mobile Device Management) Console Screenshots",
      "Device Encryption Status Reports",
      "Data Loss Prevention (DLP) Configurations"
    ],
    interviewQuestions: [
      "Are all mobile devices encrypted?",
      "What encryption standard is used (AES-256)?",
      "How do you verify encryption is enabled on all devices?",
      "What happens if an unencrypted device is discovered?"
    ],
    testMethods: ["examine", "test"]
  },
  {
    id: "AC.L2-3.1.3",
    family: "AC",
    level: 2,
    number: "3.1.3",
    title: "Control CUI Flow Across Boundaries",
    description: "Control the flow of CUI across boundaries.",
    discussion: "Boundaries include system boundaries and network boundaries. Organizations can use data loss prevention (DLP) tools, firewalls, and other boundary protection mechanisms to control the flow of CUI. This includes controlling data exfiltration and unauthorized data movement.",
    relatedControls: ["SC.L1-3.13.1", "SC.L2-3.13.5", "SC.L2-3.13.6"],
    assessmentObjective: "Determine if the flow of CUI across system and network boundaries is controlled.",
    potentialAssessors: ["Network Administrator", "Security Engineer", "System Architect"],
    cmmcLevel: 2,
    commonArtifacts: [
      "Network Boundary Diagrams",
      "Data Flow Diagrams",
      "Firewall Rules Documentation",
      "DLP Configuration and Logs",
      "Network Segmentation Documentation",
      "Cross-Domain Solutions (if applicable)"
    ],
    interviewQuestions: [
      "How is CUI prevented from leaving authorized boundaries?",
      "What network segmentation is in place?",
      "How are data flows between systems authorized?",
      "What tools monitor CUI movement?"
    ],
    testMethods: ["examine", "interview", "test"]
  },
  {
    id: "AC.L2-3.1.4",
    family: "AC",
    level: 2,
    number: "3.1.4",
    title: "Separate Processing Domains",
    description: "Separate the processing of different data types on separate system components or services.",
    discussion: "This requirement ensures that CUI is not commingled with non-CUI or other categories of CUI in a way that could lead to unauthorized access or disclosure. Organizations can use system partitioning, virtual machines, or containers to separate processing domains.",
    relatedControls: ["SC.L1-3.13.1", "SC.L2-3.13.5"],
    assessmentObjective: "Determine if different data types are processed on separate system components or services.",
    potentialAssessors: ["System Architect", "IT Administrator", "Security Engineer"],
    cmmcLevel: 2,
    commonArtifacts: [
      "System Architecture Diagrams",
      "Data Segregation Policy",
      "Virtual Machine/Container Configuration",
      "Network Segmentation Documentation",
      "Database Schema with Access Controls"
    ],
    interviewQuestions: [
      "How is CUI processing separated from non-CUI processing?",
      "What virtualization or containerization is used?",
      "How do you prevent data leakage between domains?",
      "Are there shared resources between domains?"
    ],
    testMethods: ["examine", "interview", "test"]
  },
  {
    id: "AC.L2-3.1.5",
    family: "AC",
    level: 2,
    number: "3.1.5",
    title: "Employ Least Privilege",
    description: "Employ the principle of least privilege, allowing only authorized accesses for users (or processes acting on behalf of users) that are necessary to accomplish assigned organizational tasks.",
    discussion: "The principle of least privilege restricts user access to the minimum necessary to perform assigned duties. This includes both read and write privileges. Organizations should regularly review and adjust privileges based on changes in duties.",
    relatedControls: ["AC.L1-3.1.1", "AC.L1-3.1.2", "AC.L2-3.1.6"],
    assessmentObjective: "Determine if the principle of least privilege is employed for user and process access.",
    potentialAssessors: ["System Administrator", "Security Officer", "IT Manager"],
    cmmcLevel: 2,
    commonArtifacts: [
      "Least Privilege Policy",
      "User Access Matrix/Roles",
      "Privileged Access Management (PAM) Configuration",
      "Regular Access Reviews Documentation",
      "Just-In-Time (JIT) Access Logs (if applicable)"
    ],
    interviewQuestions: [
      "How is least privilege implemented?",
      "How often are user privileges reviewed?",
      "Are there users with excessive privileges?",
      "How are temporary elevated privileges managed?"
    ],
    testMethods: ["examine", "interview", "test"]
  },
  {
    id: "AC.L2-3.1.6",
    family: "AC",
    level: 2,
    number: "3.1.6",
    title: "Use Non-Privileged Accounts for Non-Security Functions",
    description: "Use non-privileged accounts or non-administrative accounts when accessing non-security functions.",
    discussion: "This requirement ensures that privileged accounts are only used for administrative or security functions, not for routine tasks such as email, web browsing, or document processing. This reduces the risk of privilege escalation attacks.",
    relatedControls: ["AC.L2-3.1.5", "IA.L2-3.5.11"],
    assessmentObjective: "Determine if non-privileged accounts are used for non-security functions.",
    potentialAssessors: ["IT Administrator", "Security Officer", "HR"],
    cmmcLevel: 2,
    commonArtifacts: [
      "Privileged Account Management Policy",
      "Administrator Account Usage Logs",
      "User Account Configuration",
      "Separation of Duties Matrix",
      "Privilege Escalation Procedures"
    ],
    interviewQuestions: [
      "Do administrators use separate accounts for routine work?",
      "How is privileged account usage monitored?",
      "Are privileged accounts used for email/browsing?",
      "How are admin credentials protected?"
    ],
    testMethods: ["examine", "interview"]
  },
  {
    id: "AC.L2-3.1.7",
    family: "AC",
    level: 2,
    number: "3.1.7",
    title: "Prevent Privileged Functions without Privileged Accounts",
    description: "Prevent non-privileged users from executing privileged functions and prevent privileged users from executing non-security functions while using privileged accounts.",
    discussion: "This control works with AC.L2-3.1.6 to ensure proper separation of duties. Privileged functions include system administration, security configuration changes, and access to audit logs.",
    relatedControls: ["AC.L2-3.1.5", "AC.L2-3.1.6", "AU.L2-3.3.1"],
    assessmentObjective: "Determine if non-privileged users are prevented from executing privileged functions and privileged users are prevented from executing non-security functions with privileged accounts.",
    potentialAssessors: ["System Administrator", "Security Engineer"],
    cmmcLevel: 2,
    commonArtifacts: [
      "Group Policy Settings",
      "Role-Based Access Configuration",
      "User Rights Assignment Documentation",
      "Privilege Enforcement Mechanisms",
      "Audit Logs of Privilege Usage"
    ],
    interviewQuestions: [
      "How are privileged functions restricted?",
      "Can regular users perform administrative tasks?",
      "How is the separation enforced technically?",
      "What happens if someone tries to bypass controls?"
    ],
    testMethods: ["examine", "interview", "test"]
  },
  {
    id: "AC.L2-3.1.8",
    family: "AC",
    level: 2,
    number: "3.1.8",
    title: "Limit Unsuccessful Logon Attempts",
    description: "Limit the number of unsuccessful logon attempts.",
    discussion: "Organizations should define the maximum number of unsuccessful logon attempts before locking accounts. This protects against brute force password attacks. The threshold should balance security with usability.",
    relatedControls: ["IA.L1-3.5.1", "IA.L2-3.5.7", "SC.L2-3.14.6"],
    assessmentObjective: "Determine if the number of unsuccessful logon attempts is limited.",
    potentialAssessors: ["System Administrator", "Security Officer"],
    cmmcLevel: 2,
    commonArtifacts: [
      "Account Lockout Policy Configuration",
      "Group Policy Settings (Windows)",
      "PAM Configuration (Linux)",
      "Authentication Server Settings",
      "Failed Logon Attempt Logs"
    ],
    interviewQuestions: [
      "What is the account lockout threshold?",
      "How long are accounts locked?",
      "How are lockout events logged?",
      "Is there an alert system for multiple failures?"
    ],
    testMethods: ["examine", "interview", "test"]
  },
  {
    id: "AC.L2-3.1.9",
    family: "AC",
    level: 2,
    number: "3.1.9",
    title: "Provide Privacy and Security Notices",
    description: "Provide privacy and security notices consistent with applicable CUI rules.",
    discussion: "Notices inform users about monitoring, acceptable use, and privacy policies. These notices should be displayed at logon and on websites or applications processing CUI.",
    relatedControls: ["AC.L2-3.1.10", "PL.L1-3.4.1"],
    assessmentObjective: "Determine if privacy and security notices are provided consistent with applicable CUI rules.",
    potentialAssessors: ["Privacy Officer", "Security Officer", "Legal/Compliance"],
    cmmcLevel: 2,
    commonArtifacts: [
      "System Use Notification/Banner",
      "Privacy Policy",
      "Acceptable Use Policy",
      "Login Banner Configuration",
      "Website Privacy Notices"
    ],
    interviewQuestions: [
      "What notice is displayed at system logon?",
      "Does the notice reference CUI handling?",
      "Are users required to acknowledge the notice?",
      "How is the notice kept current?"
    ],
    testMethods: ["examine", "interview"]
  },
  {
    id: "AC.L2-3.1.10",
    family: "AC",
    level: 2,
    number: "3.1.10",
    title: "Use Session Lock with Pattern-Hiding Displays",
    description: "Use session lock with pattern-hiding displays to prevent access and viewing of data after a period of inactivity.",
    discussion: "Session locks prevent unauthorized access when users leave workstations unattended. Pattern-hiding displays prevent shoulder surfing by showing a blank screen or moving display rather than the actual content.",
    relatedControls: ["AC.L2-3.1.9", "SC.L2-3.14.7"],
    assessmentObjective: "Determine if session lock with pattern-hiding displays is used after a period of inactivity.",
    potentialAssessors: ["IT Administrator", "Security Officer"],
    cmmcLevel: 2,
    commonArtifacts: [
      "Screen Lock Policy",
      "Group Policy/Configuration Settings",
      "Screen Saver/Timeout Settings",
      "MDM Configuration for Mobile Devices",
      "Workstation Security Checklists"
    ],
    interviewQuestions: [
      "What is the session lock timeout?",
      "Do screens show content when locked?",
      "Can users disable screen locks?",
      "How is compliance monitored?"
    ],
    testMethods: ["examine", "interview", "test"]
  },
  {
    id: "AC.L2-3.1.11",
    family: "AC",
    level: 2,
    number: "3.1.11",
    title: "Terminate Sessions Automatically",
    description: "Terminate (automatically) user sessions after a defined condition.",
    discussion: "Defined conditions may include time limits, inactivity periods, or concurrent session limits. This prevents unauthorized access from abandoned sessions and reduces resource consumption.",
    relatedControls: ["AC.L2-3.1.10", "IA.L2-3.5.7"],
    assessmentObjective: "Determine if user sessions are terminated automatically after a defined condition.",
    potentialAssessors: ["System Administrator", "Application Owner"],
    cmmcLevel: 2,
    commonArtifacts: [
      "Session Timeout Configuration",
      "Application Session Settings",
      "VPN Timeout Settings",
      "Remote Access Session Limits",
      "Session Management Logs"
    ],
    interviewQuestions: [
      "When are sessions automatically terminated?",
      "What triggers session termination?",
      "How long can sessions remain idle?",
      "Are there different timeouts for different systems?"
    ],
    testMethods: ["examine", "interview", "test"]
  },
  {
    id: "AC.L2-3.1.12",
    family: "AC",
    level: 2,
    number: "3.1.12",
    title: "Monitor and Control Remote Access Sessions",
    description: "Monitor and control remote access sessions.",
    discussion: "Remote access includes VPN, remote desktop, and cloud-based access. Organizations should monitor these sessions for suspicious activity and have the ability to terminate them if necessary.",
    relatedControls: ["AC.L2-3.1.13", "AU.L2-3.3.1", "SC.L2-3.13.6"],
    assessmentObjective: "Determine if remote access sessions are monitored and controlled.",
    potentialAssessors: ["Network Administrator", "Security Operations"],
    cmmcLevel: 2,
    commonArtifacts: [
      "Remote Access Policy",
      "VPN Logs and Monitoring",
      "Remote Desktop Gateway Logs",
      "Session Recording (if used)",
      "Remote Access Authorization Records",
      "Privileged Session Monitoring"
    ],
    interviewQuestions: [
      "How are remote sessions monitored?",
      "Can remote sessions be terminated by administrators?",
      "What remote access methods are permitted?",
      "How is remote access authorized and logged?"
    ],
    testMethods: ["examine", "interview", "test"]
  },
  {
    id: "AC.L2-3.1.13",
    family: "AC",
    level: 2,
    number: "3.1.13",
    title: "Control Remote Access",
    description: "Control remote access to the system.",
    discussion: "Remote access controls include requiring MFA, using VPNs, restricting access to specific IP ranges, and limiting which systems can be accessed remotely. All remote access should be documented and authorized.",
    relatedControls: ["AC.L2-3.1.12", "IA.L2-3.5.3", "SC.L2-3.13.6"],
    assessmentObjective: "Determine if remote access to the system is controlled.",
    potentialAssessors: ["Network Administrator", "Security Engineer"],
    cmmcLevel: 2,
    commonArtifacts: [
      "Remote Access Policy",
      "VPN Configuration",
      "Firewall Rules for Remote Access",
      "Remote Access Request and Approval Forms",
      "Multi-Factor Authentication Configuration"
    ],
    interviewQuestions: [
      "Who is authorized for remote access?",
      "What security controls protect remote access?",
      "Is MFA required for all remote access?",
      "How is remote access reviewed and revoked?"
    ],
    testMethods: ["examine", "interview", "test"]
  },
  {
    id: "AC.L2-3.1.14",
    family: "AC",
    level: 2,
    number: "3.1.14",
    title: "Control Wireless Access",
    description: "Control wireless access to the system.",
    discussion: "Wireless access includes Wi-Fi, Bluetooth, and other wireless technologies. Controls include encryption (WPA2/WPA3), authentication, network segmentation, and monitoring for unauthorized access points.",
    relatedControls: ["SC.L2-3.13.5", "SC.L2-3.13.11"],
    assessmentObjective: "Determine if wireless access to the system is controlled.",
    potentialAssessors: ["Network Administrator", "Wireless Administrator"],
    cmmcLevel: 2,
    commonArtifacts: [
      "Wireless Security Policy",
      "Wireless Network Configuration",
      "Access Point Inventory and Configuration",
      "Wireless Scanning/Monitoring Reports",
      "Wi-Fi Security Certificates"
    ],
    interviewQuestions: [
      "What wireless networks exist?",
      "How is wireless access secured?",
      "Are guest and corporate networks separated?",
      "How is rogue access point detection performed?"
    ],
    testMethods: ["examine", "interview", "test"]
  },
  {
    id: "AC.L2-3.1.15",
    family: "AC",
    level: 2,
    number: "3.1.15",
    title: "Limit Wireless Connection Time",
    description: "Limit wireless access to the time necessary.",
    discussion: "This control is particularly important for guest access and temporary connections. It can be implemented through session timeouts, scheduled access windows, or temporary credentials.",
    relatedControls: ["AC.L2-3.1.14", "AC.L2-3.1.11"],
    assessmentObjective: "Determine if wireless access is limited to the time necessary.",
    potentialAssessors: ["Network Administrator", "Security Officer"],
    cmmcLevel: 2,
    commonArtifacts: [
      "Wireless Access Time Limits Configuration",
      "Guest Wireless Policy",
      "Session Timeout Settings",
      "Temporary Access Documentation"
    ],
    interviewQuestions: [
      "Are there time limits for wireless sessions?",
      "How long can users stay connected?",
      "Do temporary connections have shorter limits?",
      "Are there scheduled maintenance windows?"
    ],
    testMethods: ["examine", "interview"]
  },
  {
    id: "AC.L2-3.1.16",
    family: "AC",
    level: 2,
    number: "3.1.16",
    title: "Control Connection of Mobile Devices",
    description: "Control connection of portable and mobile devices to organizational systems.",
    discussion: "Mobile devices may introduce malware or enable data exfiltration. Controls include requiring device registration, security scanning, MDM enrollment, and restrictions on data transfer.",
    relatedControls: ["AC.L1-3.1.20", "SC.L2-3.13.5", "SI.L2-3.14.1"],
    assessmentObjective: "Determine if the connection of portable and mobile devices to organizational systems is controlled.",
    potentialAssessors: ["IT Administrator", "Security Officer"],
    cmmcLevel: 2,
    commonArtifacts: [
      "Mobile Device Policy",
      "MDM Configuration",
      "Device Registration Records",
      "NAC (Network Access Control) Configuration",
      "Device Compliance Reports"
    ],
    interviewQuestions: [
      "Can personal devices connect to the network?",
      "What checks are performed before device connection?",
      "Are mobile devices required to use MDM?",
      "How is non-compliant device access prevented?"
    ],
    testMethods: ["examine", "interview", "test"]
  },
  {
    id: "AC.L2-3.1.17",
    family: "AC",
    level: 2,
    number: "3.1.17",
    title: "Control Use of Portable Storage Devices",
    description: "Control the use of portable storage devices on organizational systems.",
    discussion: "Portable storage includes USB drives, external hard drives, and memory cards. Controls include device restrictions, encryption requirements, malware scanning, and data loss prevention.",
    relatedControls: ["MP.L2-3.8.7", "SI.L2-3.14.1", "SC.L2-3.13.5"],
    assessmentObjective: "Determine if the use of portable storage devices on organizational systems is controlled.",
    potentialAssessors: ["IT Administrator", "Security Officer"],
    cmmcLevel: 2,
    commonArtifacts: [
      "Removable Media Policy",
      "USB Device Control Configuration",
      "DLP Rules for Removable Media",
      "Device Control Software Settings",
      "Approved Device Lists"
    ],
    interviewQuestions: [
      "Are USB drives permitted?",
      "What controls exist for removable media?",
      "How is data transfer via USB monitored?",
      "Are external storage devices encrypted?"
    ],
    testMethods: ["examine", "interview", "test"]
  },
  {
    id: "AC.L2-3.1.18",
    family: "AC",
    level: 2,
    number: "3.1.18",
    title: "Limit CUI Access in Public Areas",
    description: "Limit CUI access in publicly accessible areas.",
    discussion: "Public areas include lobbies, conference rooms, and shared workspaces. Controls include physical barriers, privacy screens, access restrictions, and clear desk policies.",
    relatedControls: ["PE.L1-3.10.1", "PE.L2-3.10.4", "PE.L2-3.10.5"],
    assessmentObjective: "Determine if CUI access in publicly accessible areas is limited.",
    potentialAssessors: ["Facility Security Officer", "IT Administrator"],
    cmmcLevel: 2,
    commonArtifacts: [
      "Clean Desk Policy",
      "Privacy Screen Requirements",
      "Public Area Access Controls",
      "Visitor Escort Procedures",
      "Workstation Security in Shared Spaces"
    ],
    interviewQuestions: [
      "How is CUI protected in shared spaces?",
      "Are privacy screens required?",
      "What is the clean desk policy?",
      "Are conference rooms secured for CUI discussions?"
    ],
    testMethods: ["examine", "interview"]
  },
  {
    id: "AC.L2-3.1.19",
    family: "AC",
    level: 2,
    number: "3.1.19",
    title: "Encrypt CUI on User-Accessible Devices",
    description: "Encrypt CUI stored on or transmitted through user-accessible devices.",
    discussion: "User-accessible devices include workstations, laptops, mobile devices, and any system component users can access. Encryption protects CUI at rest and in transit on these devices.",
    relatedControls: ["AC.L1-3.1.20", "SC.L1-3.13.11", "SC.L2-3.13.12"],
    assessmentObjective: "Determine if CUI stored on or transmitted through user-accessible devices is encrypted.",
    potentialAssessors: ["IT Administrator", "Security Engineer"],
    cmmcLevel: 2,
    commonArtifacts: [
      "Device Encryption Policy",
      "Full Disk Encryption Configuration",
      "Encryption Status Reports",
      "Key Management Documentation",
      "BitLocker/FileVault Settings"
    ],
    interviewQuestions: [
      "What devices store or transmit CUI?",
      "What encryption is used on these devices?",
      "How is encryption verified and monitored?",
      "What happens if encryption is disabled?"
    ],
    testMethods: ["examine", "interview", "test"]
  },
  {
    id: "AC.L2-3.1.21",
    family: "AC",
    level: 2,
    number: "3.1.21",
    title: "Limit CUI Access to Authorized Users",
    description: "Limit access to CUI on shared system resources to authorized users.",
    discussion: "Shared system resources include file servers, databases, and cloud storage. Access controls should ensure only authorized users can access CUI, even when resources are shared among multiple users or applications.",
    relatedControls: ["AC.L1-3.1.1", "AC.L1-3.1.2", "AC.L2-3.1.5"],
    assessmentObjective: "Determine if access to CUI on shared system resources is limited to authorized users.",
    potentialAssessors: ["System Administrator", "Data Owner"],
    cmmcLevel: 2,
    commonArtifacts: [
      "File Server Permissions",
      "Database Access Controls",
      "SharePoint/Cloud Storage Permissions",
      "Access Control Lists (ACLs)",
      "Regular Access Review Records"
    ],
    interviewQuestions: [
      "Who can access shared CUI repositories?",
      "How are permissions on shared resources managed?",
      "How is CUI separated from non-CUI on shared drives?",
      "How often are shared resource permissions reviewed?"
    ],
    testMethods: ["examine", "interview", "test"]
  },
  {
    id: "AC.L3-3.1.22",
    family: "AC",
    level: 3,
    number: "3.1.22",
    title: "Control Information Sharing",
    description: "Control information sharing of CUI on connected systems.",
    discussion: "Connected systems include interconnected networks, cloud services, and cross-organizational connections. Information sharing controls prevent unauthorized CUI disclosure across system boundaries.",
    relatedControls: ["AC.L2-3.1.3", "SC.L2-3.13.5", "SC.L3-3.13.13"],
    assessmentObjective: "Determine if information sharing of CUI on connected systems is controlled.",
    potentialAssessors: ["System Architect", "Security Engineer"],
    cmmcLevel: 3,
    commonArtifacts: [
      "Information Sharing Agreements",
      "Cross-Domain Solutions",
      "Data Loss Prevention Configuration",
      "Interconnection Security Agreements (ISAs)",
      "Boundary Protection Documentation"
    ],
    interviewQuestions: [
      "What systems are connected to the CUI environment?",
      "How is CUI sharing controlled between systems?",
      "Are there data flow restrictions?",
      "How is information sharing authorized?"
    ],
    testMethods: ["examine", "interview", "test"]
  },

  // ============================================
  // AWARENESS AND TRAINING (AT)
  // ============================================
  {
    id: "AT.L1-3.2.1",
    family: "AT",
    level: 1,
    number: "3.2.1",
    title: "Conduct Security Awareness Training",
    description: "Provide security awareness training to system users (including managers, senior executives, and contractors) as part of initial training and at least annually thereafter.",
    discussion: "Security awareness training ensures users understand their security responsibilities, recognize security threats, and know how to report incidents. Training should be tailored to different roles and updated regularly.",
    relatedControls: ["AT.L2-3.2.2", "AT.L2-3.2.3", "PS.L2-3.9.2"],
    assessmentObjective: "Determine if security awareness training is provided to system users as part of initial training and at least annually thereafter.",
    potentialAssessors: ["Training Officer", "Security Officer", "HR"],
    cmmcLevel: 1,
    commonArtifacts: [
      "Security Awareness Training Policy",
      "Training Curriculum/Materials",
      "Training Completion Records",
      "Training Schedule",
      "Acknowledgment Forms"
    ],
    interviewQuestions: [
      "What security awareness training is provided?",
      "How often is training conducted?",
      "Who receives the training?",
      "How is training completion tracked?"
    ],
    testMethods: ["examine", "interview"]
  },
  {
    id: "AT.L2-3.2.2",
    family: "AT",
    level: 2,
    number: "3.2.2",
    title: "Provide Role-Based Security Training",
    description: "Provide role-based security training to personnel with assigned security roles and responsibilities before authorizing access to the system or performing assigned duties, and annually thereafter.",
    discussion: "Role-based training addresses specific security responsibilities for different positions. This includes system administrators, security officers, incident responders, and others with privileged access or security duties.",
    relatedControls: ["AT.L1-3.2.1", "AT.L2-3.2.3"],
    assessmentObjective: "Determine if role-based security training is provided to personnel with assigned security roles before access authorization and annually thereafter.",
    potentialAssessors: ["Training Officer", "Security Officer"],
    cmmcLevel: 2,
    commonArtifacts: [
      "Role-Based Training Curriculum",
      "Training Records by Role",
      "Training Gap Analysis",
      "Technical Training Materials",
      "Certification Records"
    ],
    interviewQuestions: [
      "What role-specific training exists?",
      "Who receives privileged user training?",
      "How does training differ by role?",
      "What technical training is provided for administrators?"
    ],
    testMethods: ["examine", "interview"]
  },
  {
    id: "AT.L2-3.2.3",
    family: "AT",
    level: 2,
    number: "3.2.3",
    title: "Provide Practical Exercises",
    description: "Provide practical exercises in security awareness training that simulate actual cyber attacks.",
    discussion: "Practical exercises help users recognize and respond to real-world threats. These can include phishing simulations, social engineering tests, and tabletop exercises that reinforce training concepts.",
    relatedControls: ["AT.L1-3.2.1", "AT.L2-3.2.2", "IR.L2-3.6.2"],
    assessmentObjective: "Determine if practical exercises that simulate actual cyber attacks are included in security awareness training.",
    potentialAssessors: ["Training Officer", "Security Officer"],
    cmmcLevel: 2,
    commonArtifacts: [
      "Phishing Simulation Reports",
      "Tabletop Exercise Documentation",
      "Social Engineering Test Results",
      "Exercise Scenarios and Scripts",
      "User Performance Metrics"
    ],
    interviewQuestions: [
      "What practical exercises are conducted?",
      "Are phishing simulations performed?",
      "How often are exercises conducted?",
      "How are exercise results used to improve training?"
    ],
    testMethods: ["examine", "interview"]
  },
  {
    id: "AT.L2-3.2.4",
    family: "AT",
    level: 2,
    number: "3.2.4",
    title: "Provide Insider Threat Awareness",
    description: "Provide training to personnel on how to identify and report potential insider threats.",
    discussion: "Insider threats include both malicious insiders and unintentional insider actions that could compromise CUI. Training should cover behavioral indicators, reporting procedures, and prevention measures.",
    relatedControls: ["AT.L1-3.2.1", "IR.L2-3.6.2", "PS.L2-3.9.2"],
    assessmentObjective: "Determine if training is provided on how to identify and report potential insider threats.",
    potentialAssessors: ["Security Officer", "HR", "Training Officer"],
    cmmcLevel: 2,
    commonArtifacts: [
      "Insider Threat Training Materials",
      "Insider Threat Awareness Program",
      "Reporting Procedures Documentation",
      "Behavioral Indicator Guides",
      "Training Attendance Records"
    ],
    interviewQuestions: [
      "What insider threat training is provided?",
      "How do employees report suspicious behavior?",
      "What indicators are covered in training?",
      "Is there an anonymous reporting mechanism?"
    ],
    testMethods: ["examine", "interview"]
  },

  // ============================================
  // AUDIT AND ACCOUNTABILITY (AU)
  // ============================================
  {
    id: "AU.L2-3.3.1",
    family: "AU",
    level: 2,
    number: "3.3.1",
    title: "Create and Retain Audit Logs",
    description: "Create and retain system audit logs and records to the extent needed to enable the monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity.",
    discussion: "Audit logs provide evidence of system activity for security monitoring and investigations. Logs should capture relevant events including authentication attempts, access to CUI, privilege changes, and security configuration changes.",
    relatedControls: ["AU.L2-3.3.2", "AU.L2-3.3.3", "AU.L2-3.3.4"],
    assessmentObjective: "Determine if system audit logs and records are created and retained to enable monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity.",
    potentialAssessors: ["Security Operations", "System Administrator", "Auditor"],
    cmmcLevel: 2,
    commonArtifacts: [
      "Audit Logging Policy",
      "Audit Log Configuration",
      "Log Retention Schedule",
      "SIEM Configuration",
      "Sample Audit Logs",
      "Log Storage Architecture"
    ],
    interviewQuestions: [
      "What events are logged?",
      "How long are logs retained?",
      "Who has access to audit logs?",
      "How are logs protected from tampering?"
    ],
    testMethods: ["examine", "interview"]
  },
  {
    id: "AU.L2-3.3.2",
    family: "AU",
    level: 2,
    number: "3.3.2",
    title: "Ensure Audit Logging of Events",
    description: "Ensure that the events specified in AU.L2-3.3.1 are logged, including the event types, event date/time, user/process ID, and success/failure indicators.",
    discussion: "Specific events to log include logon/logoff, file access, privilege escalation, security configuration changes, and administrative actions. The required data elements ensure logs are useful for investigations.",
    relatedControls: ["AU.L2-3.3.1", "AU.L2-3.3.3"],
    assessmentObjective: "Determine if the specified events are logged with event types, date/time, user/process ID, and success/failure indicators.",
    potentialAssessors: ["System Administrator", "Security Engineer"],
    cmmcLevel: 2,
    commonArtifacts: [
      "Audit Configuration Settings",
      "Event Log Schema Documentation",
      "Group Policy Audit Settings",
      "Syslog Configuration",
      "Sample Log Entries"
    ],
    interviewQuestions: [
      "What specific events are logged?",
      "What information is captured for each event?",
      "Are both success and failure events logged?",
      "How are event types categorized?"
    ],
    testMethods: ["examine", "interview", "test"]
  },
  {
    id: "AU.L2-3.3.3",
    family: "AU",
    level: 2,
    number: "3.3.3",
    title: "Review Audit Logs",
    description: "Review audit logs.",
    discussion: "Regular audit log reviews help identify security incidents, policy violations, and system anomalies. Reviews should be conducted by personnel independent of the activity being reviewed.",
    relatedControls: ["AU.L2-3.3.1", "AU.L2-3.3.4", "IR.L2-3.6.1"],
    assessmentObjective: "Determine if audit logs are reviewed.",
    potentialAssessors: ["Security Operations", "Auditor", "Security Officer"],
    cmmcLevel: 2,
    commonArtifacts: [
      "Audit Review Procedures",
      "Log Review Schedule",
      "Review Documentation/Checklists",
      "SIEM Alert Configuration",
      "Review Reports and Findings"
    ],
    interviewQuestions: [
      "How often are audit logs reviewed?",
      "Who performs the log reviews?",
      "What tools assist with log review?",
      "What happens when suspicious activity is found?"
    ],
    testMethods: ["examine", "interview"]
  },
  {
    id: "AU.L2-3.3.4",
    family: "AU",
    level: 2,
    number: "3.3.4",
    title: "Alert for Audit Logging failures",
    description: "Alert in the event of an audit logging failure.",
    discussion: "Audit logging failures may indicate system compromise or technical issues that could result in loss of security monitoring capability. Alerts ensure timely response to restore logging.",
    relatedControls: ["AU.L2-3.3.1", "IR.L2-3.6.1"],
    assessmentObjective: "Determine if alerts are generated in the event of an audit logging failure.",
    potentialAssessors: ["System Administrator", "Security Operations"],
    cmmcLevel: 2,
    commonArtifacts: [
      "Audit Failure Alert Configuration",
      "Alerting Procedures",
      "Escalation Matrix",
      "Monitoring Dashboard Settings",
      "Sample Alert Messages"
    ],
    interviewQuestions: [
      "What triggers an audit logging failure alert?",
      "Who receives the alerts?",
      "What is the response procedure?",
      "How quickly must failures be addressed?"
    ],
    testMethods: ["examine", "interview", "test"]
  },
  {
    id: "AU.L2-3.3.5",
    family: "AU",
    level: 2,
    number: "3.3.5",
    title: "Correlate Audit Logs",
    description: "Correlate audit logs.",
    discussion: "Correlation of logs from multiple sources helps identify complex attacks that span multiple systems. This can be done through SIEM tools or manual analysis of centralized logs.",
    relatedControls: ["AU.L2-3.3.1", "AU.L2-3.3.6", "IR.L2-3.6.1"],
    assessmentObjective: "Determine if audit logs are correlated.",
    potentialAssessors: ["Security Operations", "Security Engineer"],
    cmmcLevel: 2,
    commonArtifacts: [
      "SIEM Correlation Rules",
      "Log Correlation Procedures",
      "Centralized Logging Architecture",
      "Correlation Use Cases",
      "Event Correlation Reports"
    ],
    interviewQuestions: [
      "How are logs from different sources correlated?",
      "What correlation rules are in place?",
      "What SIEM or correlation tools are used?",
      "What patterns are detected through correlation?"
    ],
    testMethods: ["examine", "interview"]
  },
  {
    id: "AU.L2-3.3.6",
    family: "AU",
    level: 2,
    number: "3.3.6",
    title: "Protect Audit Information",
    description: "Protect audit information and audit tools.",
    discussion: "Audit information must be protected from unauthorized access, modification, and deletion to ensure its integrity and availability for investigations. This includes both the logs themselves and the tools used to manage them.",
    relatedControls: ["AU.L2-3.3.1", "MP.L2-3.8.2", "SC.L1-3.13.11"],
    assessmentObjective: "Determine if audit information and audit tools are protected from unauthorized access, modification, and deletion.",
    potentialAssessors: ["System Administrator", "Security Officer"],
    cmmcLevel: 2,
    commonArtifacts: [
      "Audit Log Protection Controls",
      "Access Controls on Log Repositories",
      "Log Integrity Verification",
      "Encryption of Log Data",
      "Audit Tool Access Restrictions"
    ],
    interviewQuestions: [
      "Who can access audit logs?",
      "How are logs protected from modification?",
      "Are audit tools restricted to authorized users?",
      "How is log integrity verified?"
    ],
    testMethods: ["examine", "interview", "test"]
  },
  {
    id: "AU.L2-3.3.7",
    family: "AU",
    level: 2,
    number: "3.3.7",
    title: "Provide Audit Reduction Report",
    description: "Provide a system capability that supports audit reduction and reporting.",
    discussion: "Audit reduction capabilities help analyze large volumes of log data to identify security-relevant events. Reporting capabilities enable generation of compliance reports and security summaries.",
    relatedControls: ["AU.L2-3.3.1", "AU.L2-3.3.3", "AU.L2-3.3.5"],
    assessmentObjective: "Determine if system capabilities support audit reduction and reporting.",
    potentialAssessors: ["Security Operations", "Security Engineer"],
    cmmcLevel: 2,
    commonArtifacts: [
      "SIEM Reporting Capabilities",
      "Audit Reduction Tools",
      "Report Templates",
      "Compliance Dashboards",
      "Automated Report Generation"
    ],
    interviewQuestions: [
      "What audit reduction capabilities exist?",
      "What reports can be generated?",
      "How are compliance reports produced?",
      "What automation exists for reporting?"
    ],
    testMethods: ["examine", "interview", "test"]
  },
  {
    id: "AU.L2-3.3.8",
    family: "AU",
    level: 2,
    number: "3.3.8",
    title: "Manage Audit Log Storage Capacity",
    description: "Manage audit log storage capacity.",
    discussion: "Audit logs can consume significant storage. Organizations must ensure sufficient capacity while maintaining retention requirements. This includes log rotation, compression, and archival strategies.",
    relatedControls: ["AU.L2-3.3.1", "AU.L2-3.3.6"],
    assessmentObjective: "Determine if audit log storage capacity is managed.",
    potentialAssessors: ["System Administrator", "IT Operations"],
    cmmcLevel: 2,
    commonArtifacts: [
      "Log Storage Capacity Plan",
      "Log Rotation Configuration",
      "Storage Monitoring Reports",
      "Log Archival Procedures",
      "Capacity Planning Documentation"
    ],
    interviewQuestions: [
      "How is log storage capacity managed?",
      "What happens when storage is full?",
      "How are old logs archived?",
      "What is the log retention policy?"
    ],
    testMethods: ["examine", "interview"]
  },
  {
    id: "AU.L2-3.3.9",
    family: "AU",
    level: 2,
    number: "3.3.9",
    title: "Protect Audit Data from Modification",
    description: "Protect information obtained from audit log monitoring from unauthorized modification and deletion.",
    discussion: "This control specifically addresses protection of audit monitoring results and analysis, not just the raw logs. This ensures the integrity of security analysis and investigation results.",
    relatedControls: ["AU.L2-3.3.6", "MP.L2-3.8.2"],
    assessmentObjective: "Determine if audit monitoring information is protected from unauthorized modification and deletion.",
    potentialAssessors: ["Security Operations", "System Administrator"],
    cmmcLevel: 2,
    commonArtifacts: [
      "Access Controls on Analysis Results",
      "SIEM Data Protection",
      "Change Control for Reports",
      "Backup of Analysis Data",
      "Integrity Verification"
    ],
    interviewQuestions: [
      "How are audit analysis results protected?",
      "Who can modify security reports?",
      "Are investigation results protected?",
      "How is data integrity maintained?"
    ],
    testMethods: ["examine", "interview"]
  },
  {
    id: "AU.L2-3.3.10",
    family: "AU",
    level: 2,
    number: "3.3.10",
    title: "Synchronize System Clocks",
    description: "Synchronize system clocks to authoritative time source.",
    discussion: "Accurate time stamps are essential for log correlation and investigation. All systems should synchronize to the same authoritative time source to ensure consistent timestamps across logs.",
    relatedControls: ["AU.L2-3.3.1", "AU.L2-3.3.2"],
    assessmentObjective: "Determine if system clocks are synchronized to an authoritative time source.",
    potentialAssessors: ["System Administrator", "Network Administrator"],
    cmmcLevel: 2,
    commonArtifacts: [
      "NTP Configuration",
      "Time Synchronization Policy",
      "Time Server Documentation",
      "Clock Drift Monitoring",
      "Time Zone Configuration"
    ],
    interviewQuestions: [
      "What time source is used?",
      "How are system clocks synchronized?",
      "What is the synchronization frequency?",
      "How is time accuracy verified?"
    ],
    testMethods: ["examine", "interview", "test"]
  },
];

// Export families for categorization
export const CONTROL_FAMILIES = {
  AC: "Access Control",
  AT: "Awareness and Training",
  AU: "Audit and Accountability",
  CM: "Configuration Management",
  IA: "Identification and Authentication",
  IR: "Incident Response",
  MA: "Maintenance",
  MP: "Media Protection",
  PE: "Physical Protection",
  PS: "Personnel Security",
  RA: "Risk Assessment",
  CA: "Security Assessment",
  SC: "System and Communications Protection",
  SI: "System and Information Integrity",
  SA: "System and Services Acquisition",
  SR: "Supply Chain Risk Management",
} as const;

// CMMC Level 1 Controls (Basic Safeguarding)
export const CMMC_LEVEL_1_CONTROLS = NIST_CONTROLS.filter(c => c.cmmcLevel === 1);

// CMMC Level 2 Controls (DFARS 252.204-7012 Alignment)
export const CMMC_LEVEL_2_CONTROLS = NIST_CONTROLS.filter(c => c.cmmcLevel <= 2);

// CMMC Level 3 Controls (Enhanced Security)
export const CMMC_LEVEL_3_CONTROLS = NIST_CONTROLS;

// Helper function to get control by ID
export function getControlById(id: string): NISTControl | undefined {
  return NIST_CONTROLS.find(c => c.id === id);
}

// Helper function to get controls by family
export function getControlsByFamily(family: string): NISTControl[] {
  return NIST_CONTROLS.filter(c => c.family === family);
}

// Helper function to get controls by level
export function getControlsByLevel(level: 1 | 2 | 3): NISTControl[] {
  return NIST_CONTROLS.filter(c => c.cmmcLevel <= level);
}
