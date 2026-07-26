-- Prevent invites from granting the superadmin role.
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_role_not_superadmin" CHECK (role != 'superadmin');

-- Block any UPDATE that promotes an existing user to superadmin.
-- The partial index blocks two simultaneous superadmins but not demote -> promote.
CREATE OR REPLACE FUNCTION prevent_superadmin_escalation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'superadmin' AND OLD.role != 'superadmin' THEN
    RAISE EXCEPTION 'Escalation to superadmin via UPDATE is not permitted.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- A user's role can never be changed TO 'superadmin' via SQL.
CREATE TRIGGER "User_no_superadmin_escalation"
BEFORE UPDATE OF role ON "User"
FOR EACH ROW
EXECUTE FUNCTION prevent_superadmin_escalation();
