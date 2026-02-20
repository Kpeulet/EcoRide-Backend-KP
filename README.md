# Structure Git — Conventions & Organisation
Ce dossier définit les règles de travail collaboratif et la structure du projet EcoRide.

🧱 Structure du repository
Code
Structure-Git/
1-Frontend/
2-Backend/
🌿 Branches Git
Branches principales
main → production

dev → développement stable

Branches de travail
Format recommandé :

Code
feature/<nom-fonctionnalité>
fix/<nom-correctif>
docs/<documentation>
Exemples :

Code
feature/us-8-vehicules
fix/ride-validation
docs/readme-backend
🧪 Workflow Git
Créer une branche depuis dev

Développer la fonctionnalité

Commit propre et clair

Push

Pull Request vers dev

Revue + merge

📝 Conventions de commit
Format recommandé :

Code
feat: ajout de la création de trajet
fix: correction validation avis
docs: mise à jour du README
refactor: simplification du rideController
style: formatage / indentation
📦 Organisation des dossiers
1-Frontend → Interface utilisateur

2-Backend → API REST

Structure-Git → Documentation interne

🛡️ Qualité & bonnes pratiques
Pas de code mort

Pas de console.log en production

Respect des conventions de nommage

Tests manuels via Postman avant merge