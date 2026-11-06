@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
}

html {
  scroll-behavior: smooth;
}

body {
  @apply bg-[#07070d] text-slate-100 antialiased;
  font-family: Arial, Helvetica, sans-serif;
}

* {
  box-sizing: border-box;
}

button,
input,
select {
  @apply outline-none;
}

button:focus-visible,
input:focus-visible,
select:focus-visible {
  box-shadow: 0 0 0 2px rgba(167, 139, 250, 0.8);
}
