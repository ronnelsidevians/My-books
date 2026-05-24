/* ============================================
   7 ТЕМ ОФОРМЛЕННЯ
   ============================================ */

:root {
  --transition-speed: 0.3s;
}

[data-theme="dark"] {
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --bg-card: #0f3460;
  --bg-hover: #1a4a7a;
  --text-primary: #eaeaea;
  --text-secondary: #a0a0a0;
  --accent: #e94560;
  --accent-hover: #ff6b6b;
  --border: #2a2a4a;
  --shadow: rgba(0, 0, 0, 0.5);
  --success: #4ecca3;
  --header-bg: #16213e;
  --reader-bg: #1a1a2e;
}

[data-theme="light"] {
  --bg-primary: #f5f5f5;
  --bg-secondary: #ffffff;
  --bg-card: #ffffff;
  --bg-hover: #e8e8e8;
  --text-primary: #2c3e50;
  --text-secondary: #7f8c8d;
  --accent: #3498db;
  --accent-hover: #2980b9;
  --border: #ddd;
  --shadow: rgba(0, 0, 0, 0.1);
  --success: #27ae60;
  --header-bg: #ffffff;
  --reader-bg: #fafafa;
}

[data-theme="warm"] {
  --bg-primary: #2c1810;
  --bg-secondary: #3d2418;
  --bg-card: #4a2c1a;
  --bg-hover: #5d3a22;
  --text-primary: #f4e4c1;
  --text-secondary: #c9b896;
  --accent: #e67e22;
  --accent-hover: #f39c12;
  --border: #5d3a22;
  --shadow: rgba(0, 0, 0, 0.4);
  --success: #2ecc71;
  --header-bg: #3d2418;
  --reader-bg: #2c1810;
}

[data-theme="mint"] {
  --bg-primary: #1a3a3a;
  --bg-secondary: #234b4b;
  --bg-card: #2d5a5a;
  --bg-hover: #3a6e6e;
  --text-primary: #e0f2f1;
  --text-secondary: #80cbc4;
  --accent: #26a69a;
  --accent-hover: #4db6ac;
  --border: #3a6e6e;
  --shadow: rgba(0, 0, 0, 0.3);
  --success: #66bb6a;
  --header-bg: #234b4b;
  --reader-bg: #1a3a3a;
}

[data-theme="sage"] {
  --bg-primary: #f5f5f0;
  --bg-secondary: #e8e8e0;
  --bg-card: #ffffff;
  --bg-hover: #d8d8d0;
  --text-primary: #2d3436;
  --text-secondary: #636e72;
  --accent: #7d8471;
  --accent-hover: #8b9576;
  --border: #c8c8be;
  --shadow: rgba(0, 0, 0, 0.08);
  --success: #55efc4;
  --header-bg: #e8e8e0;
  --reader-bg: #f5f5f0;
}

[data-theme="blue"] {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-card: #334155;
  --bg-hover: #475569;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --accent: #3b82f6;
  --accent-hover: #60a5fa;
  --border: #475569;
  --shadow: rgba(0, 0, 0, 0.4);
  --success: #34d399;
  --header-bg: #1e293b;
  --reader-bg: #0f172a;
}

[data-theme="newspaper"] {
  --bg-primary: #f4f1ea;
  --bg-secondary: #e8e4d9;
  --bg-card: #fffef8;
  --bg-hover: #ddd8cc;
  --text-primary: #2c241b;
  --text-secondary: #5c5145;
  --accent: #8b4513;
  --accent-hover: #a0522d;
  --border: #c4bdb0;
  --shadow: rgba(0, 0, 0, 0.15);
  --success: #556b2f;
  --header-bg: #e8e4d9;
  --reader-bg: #f4f1ea;
}

* {
  transition: background-color var(--transition-speed) ease,
              color var(--transition-speed) ease,
              border-color var(--transition-speed) ease,
              box-shadow var(--transition-speed) ease;
}
