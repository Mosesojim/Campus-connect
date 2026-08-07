const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const insertLogic = `
      if (data && data.user && role === 'provider') {
        const { error: insertError } = await supabase.from('providers').insert([{
          email: email,
          full_name: fullName,
          state: state,
          university: university,
          services: {}
        }]);
        if (insertError) {
          console.warn("Failed to insert provider profile during signup:", insertError.message);
        }
      }
      res.json({ message: "Account created successfully!" });
`;

code = code.replace('      res.json({ message: "Account created successfully!" });', insertLogic);
fs.writeFileSync('server.ts', code);
