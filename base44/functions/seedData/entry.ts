import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin' && user?.role !== 'super_admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Sample Members
    const members = [
      { full_name: "Ahmad Wijaya", email: "ahmad@knpi.org", phone: "+62811234567", member_id: "KNPI001", position: "Chairperson", branch: "Jakarta Pusat", status: "active", membership_type: "regular", join_date: "2023-01-15" },
      { full_name: "Siti Nurhaliza", email: "siti@knpi.org", phone: "+62812345678", member_id: "KNPI002", position: "Vice Chairperson", branch: "Jakarta Timur", status: "active", membership_type: "premium", join_date: "2023-02-20" },
      { full_name: "Budi Santoso", email: "budi@knpi.org", phone: "+62813456789", member_id: "KNPI003", position: "Secretary", branch: "Bandung", status: "active", membership_type: "regular", join_date: "2023-03-10" },
      { full_name: "Rina Handoko", email: "rina@knpi.org", phone: "+62814567890", member_id: "KNPI004", position: "Treasurer", branch: "Surabaya", status: "active", membership_type: "regular", join_date: "2023-04-05" },
      { full_name: "Dewi Lestari", email: "dewi@knpi.org", phone: "+62815678901", member_id: "KNPI005", position: "Board Member", branch: "Jakarta Pusat", status: "active", membership_type: "regular", join_date: "2023-05-12" },
    ];

    // Sample Events
    const events = [
      { title: "National Conference 2026", description: "Annual gathering of all KNPI members", date: "2026-05-15T09:00:00Z", end_date: "2026-05-17T17:00:00Z", location: "Jakarta Convention Center", type: "conference", status: "upcoming", capacity: 500, registered_count: 245, is_featured: true, organizer: "KNPI Central", audience: "all" },
      { title: "Leadership Training Workshop", description: "Develop your leadership skills", date: "2026-04-20T10:00:00Z", end_date: "2026-04-22T16:00:00Z", location: "Bandung Training Center", type: "workshop", status: "upcoming", capacity: 100, registered_count: 67, is_featured: true, organizer: "Training Division", audience: "position", audience_positions: ["Chairperson", "Vice Chairperson", "Board Member"] },
      { title: "Regional Meetup - Southeast Zone", description: "Connect with members from southeast region", date: "2026-04-10T18:00:00Z", end_date: "2026-04-10T21:00:00Z", location: "Surabaya Hotel", type: "social", status: "upcoming", capacity: 150, registered_count: 89, organizer: "Southeast Coordinator", audience: "branch", audience_branches: ["Surabaya", "Jakarta Timur"] },
      { title: "Digital Marketing Seminar", description: "Learn latest digital marketing trends", date: "2026-03-25T14:00:00Z", end_date: "2026-03-25T17:00:00Z", location: "Online (Zoom)", type: "seminar", status: "upcoming", capacity: 300, registered_count: 156, organizer: "Communications Team", audience: "all" },
    ];

    // Sample Announcements
    const announcements = [
      { title: "Membership Renewal Period Opening", content: "The 2026 membership renewal period is now open. All members are required to renew by June 30, 2026.", category: "urgent", priority: "high", is_pinned: true, published: true, target_audience: "all" },
      { title: "New Office Hours", content: "Starting April 1st, our office will be open Monday to Friday, 9 AM to 5 PM.", category: "internal", priority: "medium", is_pinned: false, published: true, target_audience: "all" },
      { title: "Conference Schedule Released", content: "The full schedule for the National Conference 2026 is now available in the Documents section.", category: "event", priority: "high", is_pinned: true, published: true, target_audience: "all" },
      { title: "Board Meeting Minutes - March 2026", content: "Minutes from the March board meeting are available for download.", category: "general", priority: "low", is_pinned: false, published: true, target_audience: "all" },
    ];

    // Sample Documents
    const documents = [
      { title: "KNPI Constitution & Bylaws", description: "Official organizational constitution", category: "policy", file_url: "https://via.placeholder.com/500x700?text=Constitution", file_type: "PDF", file_size: "2.5 MB", access_level: "members", audience: "all", is_pinned: true, download_count: 342 },
      { title: "Annual Report 2025", description: "Comprehensive annual report with financial statements", category: "report", file_url: "https://via.placeholder.com/500x700?text=Annual+Report", file_type: "PDF", file_size: "5.2 MB", access_level: "members", audience: "all", is_pinned: true, download_count: 178 },
      { title: "Member Benefits Guide", description: "Complete guide to membership benefits and privileges", category: "guideline", file_url: "https://via.placeholder.com/500x700?text=Benefits+Guide", file_type: "PDF", file_size: "1.8 MB", access_level: "members", audience: "all", download_count: 523 },
      { title: "Conference Attendance Form", description: "Form for registering to the National Conference", category: "form", file_url: "https://via.placeholder.com/500x700?text=Registration+Form", file_type: "PDF", file_size: "0.5 MB", access_level: "members", audience: "all", download_count: 234 },
      { title: "Board Meeting Minutes - Feb 2026", description: "Official minutes from February board meeting", category: "minutes", file_url: "https://via.placeholder.com/500x700?text=Board+Minutes", file_type: "PDF", file_size: "0.9 MB", access_level: "admin", audience: "all", download_count: 45 },
    ];

    // Sample Messages
    const messages = [
      { sender_email: "ahmad@knpi.org", sender_name: "Ahmad Wijaya", recipient_email: "siti@knpi.org", recipient_name: "Siti Nurhaliza", subject: "Conference Planning Discussion", body: "Hi Siti, I wanted to discuss the logistics for the upcoming conference. Do you have time for a call this week?", is_read: true, thread_id: "thread_001" },
      { sender_email: "siti@knpi.org", sender_name: "Siti Nurhaliza", recipient_email: "ahmad@knpi.org", recipient_name: "Ahmad Wijaya", subject: "Re: Conference Planning Discussion", body: "Hi Ahmad, I'm available Thursday afternoon. Let's discuss the venue capacity and catering options.", is_read: true, thread_id: "thread_001" },
      { sender_email: "budi@knpi.org", sender_name: "Budi Santoso", recipient_email: "ahmad@knpi.org", recipient_name: "Ahmad Wijaya", subject: "Update on Membership Drive", body: "Ahmad, we've successfully enrolled 45 new members this month. The engagement rate is higher than expected!", is_read: false, thread_id: "thread_002" },
      { sender_email: "rina@knpi.org", sender_name: "Rina Handoko", recipient_email: "ahmad@knpi.org", recipient_name: "Ahmad Wijaya", subject: "Financial Report - Q1 2026", body: "Here's the financial summary for Q1. Overall, we're within budget. Please review the attached details.", is_read: true, thread_id: "thread_003" },
      { sender_email: "dewi@knpi.org", sender_name: "Dewi Lestari", recipient_email: "siti@knpi.org", recipient_name: "Siti Nurhaliza", subject: "Board Member Workshop Feedback", body: "Thank you for organizing the leadership workshop. The content was very valuable and the participants gave positive feedback.", is_read: false, thread_id: "thread_004" },
      { sender_email: "siti@knpi.org", sender_name: "Siti Nurhaliza", recipient_email: "dewi@knpi.org", recipient_name: "Dewi Lestari", subject: "Re: Board Member Workshop Feedback", body: "Thanks Dewi! I'm glad it went well. We're planning a follow-up session for April. Would you be interested in facilitating a segment?", is_read: true, thread_id: "thread_004" },
    ];

    // Sample Service Requests
    const requests = [
      { title: "Certificate of Membership", description: "Requesting official membership certificate", type: "certificate", status: "completed", priority: "medium", requester_name: "Ahmad Wijaya", requester_email: "ahmad@knpi.org", resolved_date: "2026-03-15T10:30:00Z" },
      { title: "Name Change Request", description: "Requesting to update my registered name", type: "membership_change", status: "in_review", priority: "medium", requester_name: "Siti Nurhaliza", requester_email: "siti@knpi.org" },
      { title: "Complaint - Office Service", description: "The office staff was not helpful during my visit", type: "complaint", status: "submitted", priority: "high", requester_name: "Budi Santoso", requester_email: "budi@knpi.org" },
      { title: "Suggestion - Online Portal", description: "It would be great to have a mobile app for easier access", type: "suggestion", status: "approved", priority: "low", requester_name: "Rina Handoko", requester_email: "rina@knpi.org" },
      { title: "Official Letter Request", description: "Need official letter for employer verification", type: "letter", status: "completed", priority: "high", requester_name: "Dewi Lestari", requester_email: "dewi@knpi.org", resolved_date: "2026-03-20T14:00:00Z" },
    ];

    // Sample Communities
    const communities = [
      { name: "Tech & Innovation Hub", description: "Connect with tech-savvy KNPI members interested in innovation and digital transformation", category: "professional", image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80", status: "active", is_public: true },
      { name: "Social Entrepreneurs Network", description: "For members passionate about social entrepreneurship and sustainable business practices", category: "professional", image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80", status: "active", is_public: true },
      { name: "Environmental & Sustainability", description: "Dedicated to environmental conservation and sustainable development initiatives", category: "learning", image_url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80", status: "active", is_public: true },
      { name: "Arts & Culture Circle", description: "Celebrating Indonesian arts, culture, and creative expressions", category: "hobby", image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80", status: "active", is_public: true },
      { name: "Sports & Wellness Group", description: "Promote health, fitness, and sports activities among KNPI members", category: "hobby", image_url: "https://images.unsplash.com/photo-1552821206-5a5d10d59e1d?w=600&q=80", status: "active", is_public: true },
      { name: "Mental Health & Wellness", description: "Support group for mental health awareness and wellbeing", category: "support", image_url: "https://images.unsplash.com/photo-1516321318423-f06f70a504f9?w=600&q=80", status: "active", is_public: true },
    ];

    // Sample Community Members (for the first 3 communities)
    const communityMembers = [
      // Tech & Innovation Hub
      { community_id: "", member_email: "ahmad@knpi.org", member_name: "Ahmad Wijaya", role: "admin", joined_date: "2026-01-10T08:00:00Z", status: "active" },
      { community_id: "", member_email: "siti@knpi.org", member_name: "Siti Nurhaliza", role: "moderator", joined_date: "2026-01-15T08:00:00Z", status: "active" },
      { community_id: "", member_email: "budi@knpi.org", member_name: "Budi Santoso", role: "member", joined_date: "2026-01-20T08:00:00Z", status: "active" },
      // Social Entrepreneurs Network
      { community_id: "", member_email: "siti@knpi.org", member_name: "Siti Nurhaliza", role: "admin", joined_date: "2026-02-01T08:00:00Z", status: "active" },
      { community_id: "", member_email: "rina@knpi.org", member_name: "Rina Handoko", role: "member", joined_date: "2026-02-05T08:00:00Z", status: "active" },
      // Environmental & Sustainability
      { community_id: "", member_email: "dewi@knpi.org", member_name: "Dewi Lestari", role: "admin", joined_date: "2026-02-10T08:00:00Z", status: "active" },
      { community_id: "", member_email: "budi@knpi.org", member_name: "Budi Santoso", role: "member", joined_date: "2026-02-15T08:00:00Z", status: "active" },
    ];

    // Sample Community Events (for the first 2 communities)
    const communityEvents = [
      // Tech & Innovation Hub events
      { community_id: "", title: "AI & Machine Learning Workshop", description: "Learn practical applications of AI in modern business", date: "2026-04-15T14:00:00Z", end_date: "2026-04-15T17:00:00Z", location: "Jakarta Tech Park", image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80", status: "upcoming", capacity: 50, registered_count: 32 },
      { community_id: "", title: "Digital Transformation Panel Discussion", description: "Industry experts discuss digital transformation strategies", date: "2026-04-22T10:00:00Z", end_date: "2026-04-22T12:00:00Z", location: "Online", status: "upcoming", capacity: 100, registered_count: 67 },
      // Social Entrepreneurs Network events
      { community_id: "", title: "Startup Pitch Competition", description: "Showcase your startup ideas and win prizes", date: "2026-05-01T09:00:00Z", end_date: "2026-05-01T17:00:00Z", location: "Jakarta Business Hub", image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80", status: "upcoming", capacity: 30, registered_count: 18 },
      { community_id: "", title: "Sustainable Business Models Webinar", description: "Explore profitable and sustainable business models", date: "2026-04-28T19:00:00Z", end_date: "2026-04-28T21:00:00Z", location: "Online", status: "upcoming", capacity: 200, registered_count: 145 },
    ];

    // Bulk create communities first
    const createdCommunities = await base44.asServiceRole.entities.Community.bulkCreate(communities);
    
    // Update community member community_ids
    communityMembers[0].community_id = createdCommunities[0].id;
    communityMembers[1].community_id = createdCommunities[0].id;
    communityMembers[2].community_id = createdCommunities[0].id;
    communityMembers[3].community_id = createdCommunities[1].id;
    communityMembers[4].community_id = createdCommunities[1].id;
    communityMembers[5].community_id = createdCommunities[2].id;
    communityMembers[6].community_id = createdCommunities[2].id;
    
    // Update community event community_ids
    communityEvents[0].community_id = createdCommunities[0].id;
    communityEvents[1].community_id = createdCommunities[0].id;
    communityEvents[2].community_id = createdCommunities[1].id;
    communityEvents[3].community_id = createdCommunities[1].id;

    // Bulk create all entities
    const [createdMembers, createdEvents, createdAnnouncements, createdDocuments, createdRequests, createdMessages, createdCommunityMembers, createdCommunityEvents] = await Promise.all([
      base44.asServiceRole.entities.Member.bulkCreate(members),
      base44.asServiceRole.entities.Event.bulkCreate(events),
      base44.asServiceRole.entities.Announcement.bulkCreate(announcements),
      base44.asServiceRole.entities.Document.bulkCreate(documents),
      base44.asServiceRole.entities.ServiceRequest.bulkCreate(requests),
      base44.asServiceRole.entities.Message.bulkCreate(messages),
      base44.asServiceRole.entities.CommunityMember.bulkCreate(communityMembers),
      base44.asServiceRole.entities.CommunityEvent.bulkCreate(communityEvents),
    ]);

    return Response.json({
      success: true,
      message: "Sample data seeded successfully",
      counts: {
        members: createdMembers.length,
        events: createdEvents.length,
        announcements: createdAnnouncements.length,
        documents: createdDocuments.length,
        requests: createdRequests.length,
        messages: createdMessages.length,
        communities: createdCommunities.length,
        communityMembers: createdCommunityMembers.length,
        communityEvents: createdCommunityEvents.length,
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});