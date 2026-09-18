"""
Script oficial de descarga y procesamiento de activos gráficos 2026 para Nexus Recharge.
Utiliza el API público de Apple iTunes Lookup para obtener iconos oficiales y capturas Key-Art
sin necesidad de claves de API ni autenticación, y aplica una máscara iOS Squircle con Pillow.
"""

import urllib.request
import json
import ssl
import os
import math
from PIL import Image, ImageDraw, ImageFilter

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
logos_dir = os.path.join(base_dir, 'public', 'assets', 'logos')
games_dir = os.path.join(base_dir, 'public', 'assets', 'games')
raw_dir = os.path.join(base_dir, 'scratch', 'raw_assets')

os.makedirs(logos_dir, exist_ok=True)
os.makedirs(games_dir, exist_ok=True)
os.makedirs(raw_dir, exist_ok=True)

# Mapeo de slugs a Track ID oficial de Apple App Store
app_configs = {
    'free-fire': {'id': '1300146617', 'country': 'us'},
    'fc-26': {'id': '1094930513', 'country': 'us'},
    'pubg-mobile': {'id': '1330123889', 'country': 'us'},
    'brawl-stars': {'id': '1229016807', 'country': 'us'},
    'spotify': {'id': '324684580', 'country': 'us'},
    'zinli': {'id': '1550800950', 'country': 'us'},
    'roblox': {'id': '431946152', 'country': 'us'},
    'cod-mobile': {'id': '1287282214', 'country': 'us'},
    'mobile-legends': {'id': '1160056295', 'country': 'mx'},
    'netflix': {'id': '363590051', 'country': 'us'},
    'discord-nitro': {'id': '985746746', 'country': 'us'},
    'shein': {'id': '878577184', 'country': 'us'},
    'steam': {'id': '495369748', 'country': 'us'},
    'playstation': {'id': '410896080', 'country': 'us'},
    'xbox': {'id': '736179781', 'country': 'us'},
    'apple': {'id': '375380948', 'country': 'us'},
    'google-play': {'id': '284815942', 'country': 'us'},
}

def create_ios_squircle_mask(size, radius_ratio=0.2237):
    """Crea una máscara de super-elipse con curvatura idéntica a iOS (22.37% del ancho)."""
    w, h = size
    r = int(w * radius_ratio)
    mask = Image.new('L', (w, h), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, w, h), radius=r, fill=255)
    return mask

def download_img(url, dest):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=20) as resp, open(dest, 'wb') as f:
        f.write(resp.read())

def run():
    print("=== Iniciando Actualización de Activos Oficiales 2026 ===")
    for slug, cfg in app_configs.items():
        app_id = cfg['id']
        country = cfg.get('country', 'us')
        url = f"https://itunes.apple.com/lookup?id={app_id}&country={country}"
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
                data = json.loads(resp.read().decode('utf-8'))
            
            apps = data.get('results', [])
            if not apps:
                print(f"[{slug}] No encontrado en App Store ({app_id})")
                continue
            
            app = apps[0]
            name = app.get('trackName')
            icon_url = app.get('artworkUrl512') or app.get('artworkUrl100')
            screenshots = app.get('screenshotUrls', [])
            
            print(f"Procesando [{slug}] -> {name}")
            
            # 1. Procesar Icono Oficial en formato iOS Squircle 512x512
            if icon_url:
                raw_icon = os.path.join(raw_dir, f"{slug}_icon.png")
                download_img(icon_url, raw_icon)
                
                im_icon = Image.open(raw_icon).convert('RGBA')
                im_icon = im_icon.resize((512, 512), Image.Resampling.LANCZOS)
                
                mask = create_ios_squircle_mask((512, 512), 0.2237)
                squircle_icon = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
                squircle_icon.paste(im_icon, (0, 0), mask)
                
                logo_dest = os.path.join(logos_dir, f"{slug}.png")
                squircle_icon.save(logo_dest, 'PNG', optimize=True)
                print(f"  ✓ Icono guardado: {logo_dest}")
                
            # 2. Procesar Portada Key-Art Oficial
            if screenshots:
                chosen_ss = screenshots[0]
                for ss in screenshots:
                    if 'KV' in ss or 'key' in ss.lower() or 'rivals' in ss.lower():
                        chosen_ss = ss
                        break
                
                raw_ss = os.path.join(raw_dir, f"{slug}_ss.jpg")
                download_img(chosen_ss, raw_ss)
                
                im_ss = Image.open(raw_ss).convert('RGB')
                cover_dest = os.path.join(games_dir, f"{slug}.jpg")
                sw, sh = im_ss.size
                if sh > sw:
                    target_w, target_h = 800, 600
                    bg = im_ss.resize((target_w, target_h), Image.Resampling.BILINEAR).filter(ImageFilter.GaussianBlur(radius=25))
                    scale = target_h / sh
                    fg_w = int(sw * scale)
                    fg = im_ss.resize((fg_w, target_h), Image.Resampling.LANCZOS)
                    bg.paste(fg, ((target_w - fg_w) // 2, 0))
                    bg.save(cover_dest, 'JPEG', quality=88)
                else:
                    im_ss = im_ss.resize((800, int(800 * sh / sw)), Image.Resampling.LANCZOS)
                    im_ss.save(cover_dest, 'JPEG', quality=88)
                print(f"  ✓ Portada Key-Art guardada: {cover_dest}")
                
        except Exception as e:
            print(f"  ✗ Error en {slug}: {e}")

if __name__ == '__main__':
    run()
