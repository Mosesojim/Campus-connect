const fs = require('fs');
let profileTs = fs.readFileSync('src/profile.ts', 'utf8');

profileTs = profileTs.replace(
  `  // Fetch full profile from backend to get images and fresh data
  try {
    const res = await fetch(\`/api/provider/\${user.email}\`);
    if (res.ok) {
      const dbUser = await res.json();
      if (dbUser && dbUser.email) {
        Object.assign(user, dbUser);
        if (dbUser.profile_image) user.profile_image = dbUser.profile_image;
        if (dbUser.cover_image) user.cover_image = dbUser.cover_image;
      }
    }
  } catch (err) {
    console.error("Error fetching fresh profile:", err);
  }`,
  `  // Fetch full profile from backend to get images and fresh data (non-blocking)
  fetch(\`/api/provider/\${user.email}\`).then(async (res) => {
    if (res.ok) {
      const dbUser = await res.json();
      if (dbUser && dbUser.email) {
        Object.assign(user, dbUser);
        if (dbUser.profile_image) user.profile_image = dbUser.profile_image;
        if (dbUser.cover_image) user.cover_image = dbUser.cover_image;
        setCurrentUser(user); // Optional: save updated to local storage
      }
    }
  }).catch(err => {
    console.error("Error fetching fresh profile:", err);
  });`
);

fs.writeFileSync('src/profile.ts', profileTs);
console.log("Patched profile fetch");
