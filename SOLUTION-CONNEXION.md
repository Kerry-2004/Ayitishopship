# 🔴 Solution: "Invalid login credentials"

## Le problème

Vous essayez de vous connecter avec `agent@ayitishopship.com` mais vous obtenez l'erreur **"Invalid login credentials"**.

## La cause

L'utilisateur **n'existe pas encore** dans votre base de données Supabase.

## La solution rapide (5 minutes)

### Étape 1: Créer l'utilisateur ⚡

1. Ouvrez https://supabase.com/dashboard
2. Sélectionnez votre projet: **ysljvvzuiahymadufqjg**
3. Menu gauche → **Authentication** → **Users**
4. Cliquez sur **"Add user"** (bouton vert)

Remplissez:
```
Email: agent@ayitishopship.com
Password: VotreMotDePasse123!  (choisissez un bon mot de passe)
☑ Auto Confirm User  ← IMPORTANT: Cochez cette case!
```

5. Cliquez sur **"Create user"**
6. **IMPORTANT**: Notez l'UUID qui apparaît (ex: `abc123-def456-...`)

### Étape 2: Ajouter l'agent dans la table 📋

1. Menu gauche → **Table Editor**
2. Sélectionnez la table **"agents"**
3. Cliquez sur **"Insert"** → **"Insert row"**

Remplissez:
```
id: [Collez l'UUID noté ci-dessus]
nom_complet: Agent Principal
email: agent@ayitishopship.com
mot_de_passe: temp_hash
telephone: +15082463522
role: admin
bureau_localisation: Miami
actif: true  ← Cochez cette case!
```

4. Cliquez sur **"Save"**

### Étape 3: Tester la connexion ✅

1. Retournez sur votre app: `http://localhost:5173/agent-space`
2. Connectez-vous avec:
   - Email: `agent@ayitishopship.com`
   - Mot de passe: Celui que vous avez défini à l'étape 1
3. ✅ **Ça marche!** Vous êtes dans le Dashboard!

## Si ça ne marche toujours pas

### Vérification 1: L'utilisateur est-il confirmé?

Authentication → Users → Trouvez `agent@ayitishopship.com`
- Si "Confirmed" = **No** → Supprimez et recréez en cochant "Auto Confirm User"
- Si "Confirmed" = **Yes** → ✅ OK

### Vérification 2: L'agent existe-t-il dans la table?

Table Editor → agents → Cherchez `agent@ayitishopship.com`
- Si la ligne existe → ✅ OK
- Si elle n'existe pas → Refaites l'étape 2

### Vérification 3: Les UUID correspondent-ils?

L'UUID dans **Authentication → Users** DOIT être le même que l'`id` dans **Table Editor → agents**

Si différent:
```sql
-- Dans SQL Editor, exécutez:
UPDATE agents 
SET id = 'UUID_CORRECT_DEPUIS_AUTH' 
WHERE email = 'agent@ayitishopship.com';
```

### Vérification 4: L'agent est-il actif?

Table Editor → agents → agent@ayitishopship.com
- Si `actif` = false → Changez à `true`
- Si `actif` = true → ✅ OK

## Autre possibilité: Mot de passe oublié

Si l'utilisateur existe mais vous avez oublié le mot de passe:

1. Authentication → Users
2. Trouvez l'utilisateur `agent@ayitishopship.com`
3. Cliquez sur les **3 points** (⋮) → **Reset Password**
4. Entrez un nouveau mot de passe
5. Essayez de vous reconnecter

## Créer d'autres comptes

Pour créer plus d'agents, répétez les étapes 1 et 2 avec d'autres emails:
- `admin@ayitishopship.com` (role: admin)
- `scanner@ayitishopship.com` (role: scanner)
- `agent2@ayitishopship.com` (role: agent)

## Checklist complète

- [ ] Tables créées dans Supabase (migration SQL exécutée)
- [ ] Utilisateur créé dans Authentication
- [ ] "Auto Confirm User" coché
- [ ] UUID noté
- [ ] Agent ajouté dans table agents
- [ ] UUID correspond entre Auth et agents
- [ ] actif = true
- [ ] Test de connexion réussi

## Besoin d'aide?

Si vous avez suivi toutes ces étapes et ça ne marche toujours pas:

1. Ouvrez la console du navigateur (F12)
2. Regardez les erreurs lors de la connexion
3. Vérifiez le fichier `.env`:
   ```
   VITE_SUPABASE_URL=https://ysljvvzuiahymadufqjg.supabase.co
   VITE_SUPABASE_ANON_KEY=[votre clé]
   ```

---

**Résumé ultra-rapide**:
1. Supabase → Auth → Add user → `agent@ayitishopship.com` + cocher "Auto Confirm"
2. Supabase → Table agents → Insert → Copier l'UUID + remplir les infos
3. Tester la connexion → ✅ Ça marche!
