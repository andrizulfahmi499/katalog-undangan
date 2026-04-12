-- ============================================================================
-- SUPABASE INITIALIZATION SCRIPT
-- Project: Katalog Undangan
-- Purpose: Initialize database schema for UndanganSamawa platform
-- ============================================================================

-- Enable UUID extension (not needed with cuid, but good to have for future)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Admin users who manage members and invitations
CREATE TABLE "Admin" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Members who can send invitations
CREATE TABLE "Member" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    whatsapp TEXT NOT NULL,
    password TEXT NOT NULL,
    "creditPoints" INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Invitations created by admin
CREATE TABLE "Invitations" (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    location TEXT NOT NULL,
    "invitationLink" TEXT NOT NULL,
    "invitationDomain" TEXT NOT NULL,
    "templateMessage" TEXT NOT NULL,
    "costPoints" INTEGER NOT NULL DEFAULT 20,
    status TEXT NOT NULL DEFAULT 'draft',
    "editorConfig" JSONB,
    "createdById" TEXT NOT NULL,
    "assignedMemberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Invitations_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Admin"(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Invitations_assignedMemberId_fkey" FOREIGN KEY ("assignedMemberId") REFERENCES "Member"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Custom message templates created by member
CREATE TABLE "InvitationMessages" (
    id TEXT PRIMARY KEY,
    "memberId" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "messageTemplate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InvitationMessages_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InvitationMessages_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitations"(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InvitationMessages_memberId_invitationId_key" UNIQUE ("memberId", "invitationId")
);

-- Log of invitations sent by member
CREATE TABLE "InvitationSends" (
    id TEXT PRIMARY KEY,
    "memberId" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "guestWhatsapp" TEXT,
    "guestEmail" TEXT,
    "generatedMessage" TEXT NOT NULL,
    "generatedLink" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'pending',
    "errorMessage" TEXT,
    CONSTRAINT "InvitationSends_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InvitationSends_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitations"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Credit point transactions
CREATE TABLE "CreditTransaction" (
    id TEXT PRIMARY KEY,
    "memberId" TEXT NOT NULL,
    "adminId" TEXT,
    "invitationId" TEXT,
    type TEXT NOT NULL,
    amount INTEGER NOT NULL,
    description TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CreditTransaction_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CreditTransaction_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CreditTransaction_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitations"(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Invitations indexes
CREATE INDEX "Invitations_assignedMemberId_idx" ON "Invitations"("assignedMemberId");
CREATE INDEX "Invitations_createdById_idx" ON "Invitations"("createdById");
CREATE INDEX "Invitations_status_idx" ON "Invitations"(status);

-- InvitationSends indexes
CREATE INDEX "InvitationSends_memberId_idx" ON "InvitationSends"("memberId");
CREATE INDEX "InvitationSends_invitationId_idx" ON "InvitationSends"("invitationId");
CREATE INDEX "InvitationSends_status_idx" ON "InvitationSends"(status);

-- CreditTransaction indexes
CREATE INDEX "CreditTransaction_memberId_idx" ON "CreditTransaction"("memberId");
CREATE INDEX "CreditTransaction_adminId_idx" ON "CreditTransaction"("adminId");
CREATE INDEX "CreditTransaction_invitationId_idx" ON "CreditTransaction"("invitationId");

-- ============================================================================
-- TRIGGERS (Auto-update updatedAt)
-- ============================================================================

-- Function to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updatedAt
CREATE TRIGGER update_Admin_updated_at
    BEFORE UPDATE ON "Admin"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_Member_updated_at
    BEFORE UPDATE ON "Member"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_Invitations_updated_at
    BEFORE UPDATE ON "Invitations"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_InvitationMessages_updated_at
    BEFORE UPDATE ON "InvitationMessages"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- DEFAULT DATA
-- ============================================================================

-- Create default admin account
-- Email: admin@undanganku.com
-- Password: admin123
-- NOTE: This is a bcrypt hash. Generate new hash for production!
INSERT INTO "Admin" (
    id,
    name,
    email,
    password,
    "createdAt",
    "updatedAt"
) VALUES (
    'admin-default-001',
    'Administrator',
    'admin@undanganku.com',
    '$2a$10$8K1p/a0dLrXrKTyJQYw.j.XXJqZ8Y5v5x5x5x5x5x5x5x5x5x5x5x', -- Replace with actual bcrypt hash
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) - Optional but Recommended
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE "Admin" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Member" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Invitations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "InvitationMessages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "InvitationSends" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CreditTransaction" ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE "Admin" IS 'Admin users who manage members and invitations';
COMMENT ON TABLE "Member" IS 'Members who can send invitations to guests';
COMMENT ON TABLE "Invitations" IS 'Invitations created by admin and assigned to members';
COMMENT ON TABLE "InvitationMessages" IS 'Custom message templates created by members';
COMMENT ON TABLE "InvitationSends" IS 'Log of invitations sent by members to guests';
COMMENT ON TABLE "CreditTransaction" IS 'Credit point transaction history';

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

-- You can run this query to verify all tables are created:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Script completed successfully!
