import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
		keyframes: {
			"caret-blink": {
				"0%,70%,100%": { opacity: "1" },
				"20%,50%": { opacity: "0" },
			},
		},
		animation: {
			"caret-blink": "caret-blink 1.25s ease-out infinite",
		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		gridTemplateColumns: {
			'16': 'repeat(16, minmax(0, 1fr))',
			'2O': 'repeat(20, minmax(0, 1fr))',
			'24': 'repeat(24, minmax(0, 1fr))',
			'48': 'repeat(48, minmax(0, 1fr))'
		},
		gridTemplateRows: {
			'16': 'repeat(16, minmax(0, 1fr))',
			'2O': 'repeat(20, minmax(0, 1fr))',
			'24': 'repeat(24, minmax(0, 1fr))',
			'32': 'repeat(32, minmax(0, 1fr))'
		},
		gridColumnStart: {
			'14': '14',
			'15': '15',
			'16': '16',
			'17': '17',
			'18': '18',
			'19': '19',
			'20': '20',
			'21': '21',
			'22': '22',
			'23': '23',
			'24': '24',
			'25': '25',
			'26': '26',
			'27': '27',
			'28': '28',
			'29': '29',
			'30': '30',
			'31': '31',
			'32': '32',
			'33': '33',
			'34': '34',
			'35': '35',
			'36': '36',
			'37': '37',
			'38': '38',
			'39': '39',
			'40': '40',
			'41': '41',
			'42': '42',
			'43': '43',
			'44': '44',
			'45': '45',
			'46': '46',
			'47': '47',
			'48': '48'
		},
		gridRowStart: {
			'14': '14',
			'15': '15',
			'16': '16',
			'17': '17',
			'18': '18',
			'19': '19',
			'20': '20',
			'21': '21',
			'22': '22',
			'23': '23',
			'24': '24',
			'25': '25',
			'26': '26',
			'27': '27',
			'28': '28',
			'29': '29',
			'30': '30',
			'31': '31',
			'32': '32'
		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
