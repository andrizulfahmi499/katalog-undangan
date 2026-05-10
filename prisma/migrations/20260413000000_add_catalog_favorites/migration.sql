-- Add catalogLayout field to GlobalSetting
ALTER TABLE "GlobalSetting" ADD COLUMN IF NOT EXISTS "catalogLayout" TEXT NOT NULL DEFAULT 'grid';

-- Create FavoriteTheme table
CREATE TABLE IF NOT EXISTS "FavoriteTheme" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "themeSlug" TEXT NOT NULL,
    "themeName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteTheme_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint
CREATE UNIQUE INDEX IF NOT EXISTS "FavoriteTheme_memberId_themeSlug_key" ON "FavoriteTheme"("memberId", "themeSlug");

-- Create index
CREATE INDEX IF NOT EXISTS "FavoriteTheme_memberId_idx" ON "FavoriteTheme"("memberId");

-- Add foreign key constraint
ALTER TABLE "FavoriteTheme" ADD CONSTRAINT "FavoriteTheme_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
