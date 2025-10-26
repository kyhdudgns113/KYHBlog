/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}', './index.html'],
  plugins: [],
  safelist: ['w-full', 'w-1/2'],
  theme: {
    extend: {
      // prettier-ignore
      colors: {
        'gkd-sakura-bg': '#F8E8E0',                     //  720 = 8*88
        'gkd-sakura-bg-30': '#FDF8F6',
        'gkd-sakura-bg-50': '#FAF3EF',
        'gkd-sakura-bg-70': '#FAEFE9',
        'gkd-sakura-border': '#F0B8B8',                 //  608 = 8*76
        'gkd-sakura-text': '#F89890',                   //  544 = 8*68
        'gkd-sakura-darker-text': '#F05858',            //  416 = 8*52
        'gkd-sakura-hover-button': '#F8B8B0',           //  608 = 8*76
        'gkd-sakura-placeholder': '#FCC4C0',            //  640 = 8*80

        'gkd-sakura-testbtn-bg': '#F89890',             //  544 = 8*68
        'gkd-sakura-testbtn-text': '#D04040',
        'gkd-sakura-hover-testbtn-bg': '#F8B8B0',       //  608 = 8*76
        'gkd-sakura-hover-testbtn-text': '#F05858',     //  416 = 8*52
      }
    }
  }
}
