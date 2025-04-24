-- Create storage buckets for user avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB file size limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp']
);

-- Create storage policy to allow public reading of avatars
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Create storage policy to allow authenticated users to upload avatar
CREATE POLICY "Users can upload their own avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid() IS NOT NULL AND
    ((storage.foldername(name))[1] = auth.uid()::text)
  );

-- Create storage policy to allow users to update their own avatar
CREATE POLICY "Users can update their own avatars"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid() IS NOT NULL AND
    ((storage.foldername(name))[1] = auth.uid()::text)
  );

-- Create storage policy to allow users to delete their own avatar
CREATE POLICY "Users can delete their own avatars"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid() IS NOT NULL AND
    ((storage.foldername(name))[1] = auth.uid()::text)
  );

-- Create bucket for tarot card images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tarot_cards',
  'tarot_cards',
  true,
  10485760, -- 10MB file size limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Create storage policy to allow public reading of tarot cards
CREATE POLICY "Tarot card images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'tarot_cards');

-- Only allows specific service role to add/update tarot card images
CREATE POLICY "Only admins can upload tarot card images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'tarot_cards' AND
    (auth.jwt() ->> 'role')::text = 'service_role'
  );

CREATE POLICY "Only admins can update tarot card images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'tarot_cards' AND
    (auth.jwt() ->> 'role')::text = 'service_role'
  );

CREATE POLICY "Only admins can delete tarot card images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'tarot_cards' AND
    (auth.jwt() ->> 'role')::text = 'service_role'
  ); 