# 🔑 Créer un compte Agent - Guide complet

## Problème: "Invalid login credentials"

Ce message apparaît quand l'utilisateur n'existe pas dans Supabase Auth OU que le mot de passe est incorrect.

## Solution: Créer l'utilisateur dans Supabase

### Méthode 1: Via Supabase Dashboard (Recommandé)

#### Étape A: Créer l'utilisateur dans Auth

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Cliquez sur **Authentication** dans le menu de gauche
4. Cliquez sur **Users** 
5. Cliquez sur **Add user** (bouton vert en haut à droite)
6. Remplissez les informations:
   - **Email**: `agent@ayitishopship.com`
   - **Password**: Votre mot de passe sécurisé
   - ✅ **Auto Confirm User**: COCHEZ CETTE CASE (important!)
7. Cliquez sur **Create user**
8. 📝 **NOTEZ L'UUID** de l'utilisateur créé (vous le verrez dans la liste)

#### Étape B: Créer l'agent dans la table

1. Cliquez sur **Table Editor** dans le menu de gauche
2. Sélectionnez la table **agents**
3. Cliquez sur **Insert** → **Insert row**
4. Remplissez les champs:
   - **id**: Collez l'UUID noté à l'étape A
   - **nom_complet**: "Agent Principal" (ou votre nom)
   - **email**: `agent@ayitishopship.com` (même email qu'à l'étape A)
   - **mot_de_passe**: `temp_hash` (pas important, Supabase Auth gère ça)
   - **telephone**: "+15082463522" (votre téléphone)
   - **role**: `admin`
   - **bureau_localisation**: "Miami" (ou votre bureau)
   - **actif**: `true` (cochez la case)
5. Cliquez sur **Save**

### Méthode 2: Via SQL (Plus rapide)

#### Étape 1: Créer l'utilisateur dans Auth

Dans **SQL Editor**, exécutez:

```sql
-- REMPLACEZ 'votre_mot_de_passe' par votre vrai mot de passe
-- L'email peut aussi être changé si nécessaire
```

**Note**: La création d'utilisateur via SQL n'est pas recommandée. Utilisez plutôt la méthode 1 (Dashboard).

#### Étape 2: Une fois l'utilisateur créé dans Auth

Notez l'UUID de l'utilisateur, puis exécutez:

```sql
-- REMPLACEZ 'USER_UUID_ICI' par l'UUID réel de l'utilisateur créé
INSERT INTO agents (id, nom_complet, email, mot_de_passe, telephone, role, bureau_localisation, actif)
VALUES (
  'USER_UUID_ICI',  -- UUID de l'utilisateur Auth
  'Agent Principal',
  'agent@ayitishopship.com',
  'temp_hash',
  '+15082463522',
  'admin',
  'Miami',
  true
);
```

## Vérification

### Vérifier que l'utilisateur existe

#### Dans Authentication → Users
Vous devriez voir:
- ✅ Email: agent@ayitishopship.com
- ✅ Confirmed: Yes (important!)
- ✅ UUID visible

#### Dans Table Editor → agents
Vous devriez voir:
- ✅ Une ligne avec le même email
- ✅ L'UUID correspond à celui dans Auth
- ✅ actif = true

## Test de connexion

1. Allez sur: `http://localhost:5173/agent-space`
2. Entrez:
   - Email: `agent@ayitishopship.com`
   - Mot de passe: Le mot de passe que vous avez défini
3. Cliquez sur **Connexion**
4. ✅ Vous devriez être redirigé vers le Dashboard!

## Problèmes courants

### "Invalid login credentials"

**Causes possibles**:
1. L'utilisateur n'existe pas dans Auth
2. Le mot de passe est incorrect
3. L'utilisateur n'est pas confirmé (Auto Confirm User pas coché)
4. L'email ne correspond pas exactement

**Solutions**:
- Vérifiez que l'utilisateur existe dans Auth
- Vérifiez que "Confirmed" = Yes
- Réinitialisez le mot de passe si nécessaire
- Assurez-vous que l'email est exactement le même

### "User not found in agents table"

**Cause**: L'utilisateur existe dans Auth mais pas dans la table agents

**Solution**: Exécutez l'étape B (créer l'agent dans la table)

### "User is not active"

**Cause**: Le champ `actif` est à `false` dans la table agents

**Solution**:
```sql
UPDATE agents 
SET actif = true 
WHERE email = 'agent@ayitishopship.com';
```

### L'UUID ne correspond pas

**Cause**: L'UUID dans la table agents est différent de celui dans Auth

**Solution**:
1. Récupérez l'UUID correct depuis Auth → Users
2. Mettez à jour:
```sql
UPDATE agents 
SET id = 'UUID_CORRECT_ICI' 
WHERE email = 'agent@ayitishopship.com';
```

## Créer d'autres comptes agents

Pour créer plus d'agents, répétez le processus:

1. Auth → Users → Add user (avec un email différent)
2. Table → agents → Insert row (avec l'UUID correspondant)

**Roles disponibles**:
- `admin` - Accès complet + paramètres
- `agent` - Enregistrement et gestion des colis
- `scanner` - Scan QR uniquement

## Exemple complet pour créer plusieurs agents

### Agent Admin
- Email: admin@ayitishopship.com
- Role: admin
- Bureau: Miami

### Agent Scanner
- Email: scanner@ayitishopship.com
- Role: scanner
- Bureau: Port-au-Prince

### Agent Standard
- Email: agent2@ayitishopship.com
- Role: agent
- Bureau: Cap-Haïtien

## Sécurité

**Important**:
- Utilisez des mots de passe forts (minimum 8 caractères)
- Ne partagez jamais les identifiants admin
- Changez les mots de passe régulièrement
- Désactivez les comptes non utilisés (actif = false)

## Support

Si vous avez toujours des problèmes:
1. Vérifiez les logs de la console (F12)
2. Vérifiez que les tables existent dans Supabase
3. Vérifiez que la connexion Supabase fonctionne (.env correct)

---

**Checklist rapide**:
- [ ] Utilisateur créé dans Auth
- [ ] "Auto Confirm User" coché
- [ ] UUID noté
- [ ] Agent créé dans table agents
- [ ] UUID correspond entre Auth et agents
- [ ] actif = true
- [ ] Test de connexion réussi
