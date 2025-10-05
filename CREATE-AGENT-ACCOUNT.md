# Créer un compte agent

Pour utiliser l'Agent Space, vous devez créer un compte agent dans Supabase.

## Option 1: Via l'interface Supabase (Recommandé)

1. Allez sur https://supabase.com et connectez-vous
2. Sélectionnez votre projet AyitiShop&Ship
3. Allez dans "Authentication" > "Users"
4. Cliquez sur "Add user" > "Create new user"
5. Entrez:
   - Email: agent@ayitishopship.com (ou votre email)
   - Password: Choisissez un mot de passe sécurisé
   - Auto Confirm User: OUI (important!)

6. Une fois l'utilisateur créé, allez dans "Table Editor" > "agents"
7. Cliquez sur "Insert" > "Insert row"
8. Remplissez les champs:
   - id: Copiez l'UUID de l'utilisateur créé dans Authentication
   - nom_complet: "Agent Test"
   - email: agent@ayitishopship.com (même que dans Auth)
   - mot_de_passe: (hash du mot de passe - peut être laissé vide pour le moment)
   - telephone: "+1234567890"
   - role: "admin"
   - bureau_localisation: "Miami"
   - actif: true

## Option 2: Via SQL

Exécutez ce SQL dans l'éditeur SQL de Supabase:

```sql
-- 1. Créer l'utilisateur dans Auth (remplacez email et password)
-- Note: Ceci doit être fait via l'interface Auth de Supabase

-- 2. Après avoir créé l'utilisateur dans Auth, créez l'entrée dans la table agents
-- Remplacez 'USER_UUID_HERE' par l'UUID de l'utilisateur créé dans Auth
INSERT INTO agents (
  id,
  nom_complet,
  email,
  mot_de_passe,
  telephone,
  role,
  bureau_localisation,
  actif
) VALUES (
  'USER_UUID_HERE',  -- UUID de l'utilisateur Auth
  'Agent Test',
  'agent@ayitishopship.com',
  'hashed_password',  -- Hash du mot de passe (optionnel)
  '+1234567890',
  'admin',
  'Miami',
  true
);
```

## Connexion

Une fois le compte créé:

1. Allez sur: `/agent-space`
2. Connectez-vous avec:
   - Email: agent@ayitishopship.com
   - Password: Le mot de passe que vous avez défini

## Rôles disponibles

- **admin**: Accès complet à toutes les fonctionnalités
- **agent**: Peut enregistrer et gérer les colis
- **scanner**: Peut uniquement scanner et mettre à jour les statuts

## Sécurité

Pour la production:
- Utilisez des mots de passe forts
- Activez l'authentification à deux facteurs (2FA)
- Limitez les permissions selon les rôles
- Changez régulièrement les mots de passe

## Test rapide

Compte de test pour développement (à créer):
- Email: test@ayitishopship.com
- Password: Test123456! (changez-le en production!)
- Role: admin

## Problèmes courants

### "Email not confirmed"
- Assurez-vous d'activer "Auto Confirm User" lors de la création
- Ou confirmez manuellement via l'interface Supabase Auth

### "Invalid credentials"
- Vérifiez que l'email et le mot de passe sont corrects
- Vérifiez que l'utilisateur existe dans Auth ET dans la table agents

### "Account not active"
- Vérifiez que `actif = true` dans la table agents
- Mettez à jour: `UPDATE agents SET actif = true WHERE email = 'votre@email.com';`

## Support

Pour plus d'aide, consultez:
- Documentation Supabase Auth: https://supabase.com/docs/guides/auth
- Guide d'authentification: https://supabase.com/docs/guides/auth/auth-email
