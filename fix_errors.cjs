const fs = require('fs');

let code = fs.readFileSync('src/main.ts', 'utf8');

// Fix the catch block for fetchAndRenderProviders
code = code.replace(
`  } catch (err) {
    console.error(err);
  }`,
`  } catch (err: any) {
    console.error("Error fetching providers", err);
    if (err.message === "Failed to fetch") {
       console.error("Providers table query failed. Your Supabase project might be paused or cold-starting.");
    }
  }`
);

// Fix the catch block for the login/signup form
code = code.replace(
`        .catch((err) => {
          console.error(err);
          submitBtn.disabled = false;
          setBtnLoading(submitBtn as HTMLButtonElement, false, "Login");`,
`        .catch((err) => {
          console.error(err);
          if (err.message === "Failed to fetch") {
            showToast("Network error: Your Supabase project might be paused. Please unpause it in your Supabase dashboard.", "error");
          }
          submitBtn.disabled = false;
          setBtnLoading(submitBtn as HTMLButtonElement, false, "Login");`
);

code = code.replace(
`      .catch((err) => {
        console.error(err);
        submitBtn.disabled = false;
        setBtnLoading(submitBtn as HTMLButtonElement, false, "Create Account");`,
`      .catch((err) => {
        console.error(err);
        if (err.message === "Failed to fetch") {
          showToast("Network error: Your Supabase project might be paused. Please unpause it in your Supabase dashboard.", "error");
        }
        submitBtn.disabled = false;
        setBtnLoading(submitBtn as HTMLButtonElement, false, "Create Account");`
);

fs.writeFileSync('src/main.ts', code);
console.log("Patched src/main.ts");
