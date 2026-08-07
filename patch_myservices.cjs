const fs = require('fs');
let profileTs = fs.readFileSync('src/profile.ts', 'utf8');

profileTs = profileTs.replace(
  `      user.profile = user.profile || {};
      user.profile.services = services;
      // Save locally
      setCurrentUser(user);`,
  `      const currentUser = getCurrentUser() || user;
      if (!currentUser.profile) currentUser.profile = {};
      currentUser.profile.services = services;
      setCurrentUser(currentUser);
      user.profile = currentUser.profile;`
);

fs.writeFileSync('src/profile.ts', profileTs);
console.log("Patched services update");
