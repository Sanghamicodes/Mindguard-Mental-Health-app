
/*
  # Mental Health Early Warning - RLS Policies

  Adds all Row Level Security policies after all tables exist.
  Cross-table references (clinician_patients) are safe here.
*/

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Clinicians can view assigned patient profiles"
  ON profiles FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clinician_patients cp
      WHERE cp.clinician_id = auth.uid() AND cp.patient_id = profiles.id
    )
  );

-- Mood entries policies
CREATE POLICY "Users can view own mood entries"
  ON mood_entries FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood entries"
  ON mood_entries FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood entries"
  ON mood_entries FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own mood entries"
  ON mood_entries FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Clinicians can view assigned patient mood entries"
  ON mood_entries FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clinician_patients cp
      WHERE cp.clinician_id = auth.uid() AND cp.patient_id = mood_entries.user_id
    )
  );

-- Symptoms catalog (read-only for all authenticated)
CREATE POLICY "All authenticated users can view symptoms"
  ON symptoms FOR SELECT TO authenticated
  USING (true);

-- Symptom reports policies
CREATE POLICY "Users can view own symptom reports"
  ON symptom_reports FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own symptom reports"
  ON symptom_reports FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own symptom reports"
  ON symptom_reports FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own symptom reports"
  ON symptom_reports FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Clinicians can view assigned patient symptom reports"
  ON symptom_reports FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clinician_patients cp
      WHERE cp.clinician_id = auth.uid() AND cp.patient_id = symptom_reports.user_id
    )
  );

-- Alerts policies
CREATE POLICY "Users can view own alerts"
  ON alerts FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
  ON alerts FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert alerts"
  ON alerts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Clinicians can view assigned patient alerts"
  ON alerts FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clinician_patients cp
      WHERE cp.clinician_id = auth.uid() AND cp.patient_id = alerts.user_id
    )
  );

-- Clinician-Patient relationship policies
CREATE POLICY "Users can view their own assignments"
  ON clinician_patients FOR SELECT TO authenticated
  USING (auth.uid() = clinician_id OR auth.uid() = patient_id);

CREATE POLICY "Clinicians can insert assignments"
  ON clinician_patients FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = clinician_id);

CREATE POLICY "Clinicians can delete assignments"
  ON clinician_patients FOR DELETE TO authenticated
  USING (auth.uid() = clinician_id);

-- Journal entries policies
CREATE POLICY "Users can view own journal entries"
  ON journal_entries FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries"
  ON journal_entries FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries"
  ON journal_entries FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries"
  ON journal_entries FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
