# 🎨 Katalog & Spesifikasi Aset: Ayo Merangkai Kata

Dokumen ini berisi panduan lengkap, spesifikasi teknis, daftar kebutuhan aset (*asset checklist*), dan rekomendasi struktur berkas untuk meningkatkan kualitas visual (*look & feel*), sensori fisik, dan interaktivitas aplikasi **Ayo Merangkai Kata**.

---

## 📌 1. Panduan Gaya Visual (*Art Direction & Style Guide*)

Aplikasi ini mengusung tema **"Tactile Papercraft & Doodle Scrapbook"** — anak-anak merasa seolah sedang bermain di atas meja gambar fisik dengan potongan kertas warna-warni, stiker timbul, dan selotip washi tape.

* **Karakteristik Visual Utama:**
  * **Die-Cut Stickers:** Semua objek stiker memiliki garis tepi putih tebal (*white sticker contour border* 8–12px) dengan bayangan halus (*soft drop shadow*) agar terasa nyata seperti stiker fisik yang bisa dikelupas dan ditempel.
  * **Tekstur Kertas Nyata:** Tepi kertas sedikit kasar/sobekan alami (*torn paper edges*), serat kertas (*paper grain*), dan tekstur buku tulis bergaris atau bintik halus.
  * **Palet Warna Ceria & Hangat:** Warna pastel cerah yang harmonis (mint, lemon, peach, sky blue, lavender, coral) dengan garis kontur spidol gelap (*marker contour line* `#282A3A`).
* **Format File:**
  * **Stiker Karakter/Objek:** `PNG` atau `WebP` dengan latar transparan (*transparent alpha channel*).
  * **Latar Belakang / Panorama:** `WebP` atau `JPG` resolusi tinggi dengan kompresi optimal.
  * **Ikon UI & Vektor:** `SVG` untuk ketajaman sempurna di semua resolusi layar tablet & HP.
  * **Efek Suara (SFX):** `MP3` atau `WebM` stereo 44.1kHz, durasi pendek (0.1s – 2.0s) yang renyah (*crisp & snappy*).

---

## 📂 2. Rekomendasi Struktur Direktori Aset

```text
public/
├── images/
│   ├── words/               # Stiker kata transparan (Die-cut stickers)
│   ├── diorama/             # Latar panorama & ornamen 4 zona dunia
│   │   ├── zones/           # Gambar latar pemandangan panorama
│   │   └── props/           # Ornamen dekorasi (pohon, awan, jembatan, rumah)
│   ├── textures/            # Tekstur kertas fisik, alas meja, dan washi tape
│   └── ui/                  # Logo, stempel prestasi, bingkai foto, dan laci
├── audio/
│   ├── sfx/                 # Suara fisik kertas (angkat, gesek, mendarat, selotip)
│   └── actions/             # Suara interaktif habitat (meow, vroom, splash, crunch)
└── icons/                   # Favicon & icon PWA (192px, 512px)
```

---

## 📋 3. Daftar Kebutuhan Aset (*Asset Checklist*)

### A. Stiker Kosakata Die-Cut Transparan (`public/images/words/`)
> **Spesifikasi:** Format `PNG` / `WebP` transparan, resolusi `512 x 512 px`, rasio `1:1`, wajib memiliki garis batas putih tebal (*die-cut contour*).

| ID Kata | Nama Kata | Kategori | Deskripsi Visual Karakter | Status Saat Ini | Rencana Upgrade |
|---|---|---|---|---|---|
| `kucing` | KUCING | 🐱 Hewan | Kucing oranye manis bermain bola benang | JPG (Kotak) | 🔄 Ubah ke PNG Transparan Die-Cut |
| `apel` | APEL | 🍎 Buah | Apel merah segar mengkilap dengan daun hijau | JPG (Kotak) | 🔄 Ubah ke PNG Transparan Die-Cut |
| `bola` | BOLA | ⚽ Benda | Bola sepak kartun dengan garis motif ceria | JPG (Kotak) | 🔄 Ubah ke PNG Transparan Die-Cut |
| `ikan` | IKAN | 🐟 Hewan | Ikan badut/laut mungil berenang dengan gelembung | JPG (Kotak) | 🔄 Ubah ke PNG Transparan Die-Cut |
| `mobil` | MOBIL | 🚗 Benda | Mobil kuning kartun lucu dengan roda membal | JPG (Kotak) | 🔄 Ubah ke PNG Transparan Die-Cut |
| `buku` | BUKU | 📚 Benda | Buku cerita dongeng terbuka dengan bintang emas | JPG (Kotak) | 🔄 Ubah ke PNG Transparan Die-Cut |
| `singa` | SINGA | 🦁 Hewan | Singa mungil berbulu lebat yang tersenyum ramah | JPG (Kotak) | 🔄 Ubah ke PNG Transparan Die-Cut |
| `bintang` | BINTANG | ⭐ Alam | Bintang kuning berkelip dengan wajah imut | JPG (Kotak) | 🔄 Ubah ke PNG Transparan Die-Cut |
| `roti` | ROTI | 🍞 Makanan | Roti tawar panggang empuk dengan mentega meleleh | JPG (Kotak) | 🔄 Ubah ke PNG Transparan Die-Cut |
| `bebek` | BEBEK | 🦆 Hewan | Bebek kuning riang berenang di air | JPG (Kotak) | 🔄 Ubah ke PNG Transparan Die-Cut |
| `topi` | TOPI | 👒 Benda | Topi jerami pesta warna-warni berpita | JPG (Kotak) | 🔄 Ubah ke PNG Transparan Die-Cut |
| `awan` | AWAN | ☁️ Alam | Awan putih lembut tersenyum dengan rintik pelangi | JPG (Kotak) | 🔄 Ubah ke PNG Transparan Die-Cut |

#### 🌟 Kosakata Tambahan untuk Update Mendatang:
* `gajah` (🐘 GAJAH), `kupu` (🦋 KUPU), `bunga` (🌸 BUNGA), `kereta` (🚂 KERETA), `rumah` (🏠 RUMAH), `sepatu` (👟 SEPATU), `kelinci` (🐰 KELINCI), `pohon` (🌳 POHON).

---

### B. Latar Belakang & Ornamen Diorama Panorama (`public/images/diorama/`)
> **Spesifikasi:** Format `WebP` / `PNG`, resolusi total panorama `2400 x 600 px` (atau per zona `600 x 600 px`), gaya *layered papercraft collage*.

| Nama Berkas | Zona | Deskripsi Visual | Ukuran Rekomendasi | Status |
|---|---|---|---|---|
| `bg_panorama_full.webp` | Seluruh Dunia | Lanskap panorama utuh menyambungkan taman, sungai, kota, dan langit | 2400 × 600 px | ⏳ Perlu Dibuat |
| `zone_meadow_bg.webp` | 🌳 Padang Rumput | Bukit hijau berlapis kertas sobek, bunga, pohon rindang | 600 × 600 px | ⏳ Perlu Dibuat |
| `zone_stream_bg.webp` | 🐠 Aliran Sungai | Air biru beriak berlapis, jembatan kayu, tanaman air | 600 × 600 px | ⏳ Perlu Dibuat |
| `zone_city_bg.webp` | 🚗 Kota & Jalan | Gedung warna pastel, jalan aspal bergaris putih, rumah | 600 × 600 px | ⏳ Perlu Dibuat |
| `zone_sky_bg.webp` | ☁️ Langit Bintang | Langit senja pastel ungu-biru, awan kapas, bulan, bintang | 600 × 600 px | ⏳ Perlu Dibuat |

#### Ornamen Dekorasi Lepas (*Props* Transparan PNG):
* `prop_paper_tree.png`: Pohon kertas rimbun dengan buah apel menggantung.
* `prop_wooden_bridge.png`: Jembatan kayu lengkung melintasi sungai.
* `prop_paper_house.png`: Rumah kertas bertingkat atap merah ceria.
* `prop_paper_cloud.png`: Awan gumpalan kertas kapas melayang.
* `prop_paper_moon.png`: Bulan sabit kuning dengan gantungan bintang.

---

### C. Tekstur Permukaan & UI Kertas (`public/images/textures/` & `ui/`)
> **Spesifikasi:** Format `PNG` / `JPG` mulus (*seamless repeating tileable* atau *single accent*).

| Nama Berkas | Penggunaan | Deskripsi | Status |
|---|---|---|---|
| `texture_desk_mat.webp` | Meja Bermain Huruf | Tekstur alas meja belajar kayu lembut / kertas tebal | ⏳ Perlu Dibuat |
| `texture_paper_grid.png` | Lembar Buku Catatan | Garis kotak-kotak buku tulis halus transparan | ⏳ Perlu Dibuat |
| `washi_tape_stripes.png` | Hiasan Kartu Target | Potongan selotip washi motif garis-garis pastel | ⏳ Perlu Dibuat |
| `washi_tape_dots.png` | Hiasan Kartu Foto | Potongan selotip washi motif polkadot kuning | ⏳ Perlu Dibuat |
| `drawer_wood_pattern.webp`| Laci Stiker Bawah | Tekstur kotak laci kayu mainan tempat stiker | ⏳ Perlu Dibuat |
| `stamp_star_gold.png` | Stempel Koleksi | Stempel stiker bintang emas timbul | ⏳ Perlu Dibuat |
| `app_logo_papercraft.png` | Header & Splash | Logo judul bertema origami dan krayon | ⏳ Perlu Dibuat |

---

### D. Efek Suara Taktil & Karakter (`public/audio/`)
> **Spesifikasi:** Format `MP3` / `WebM` stereo, *sample rate* 44.1kHz, *bitrate* 128kbps, volume dinormalisasi.

#### 1. Suara Fisik Kertas & Mekanik (`audio/sfx/`):
* `paper_grab.mp3`: Suara desau renyah kertas saat disentuh/diangkat (0.15s).
* `paper_slide.mp3`: Suara gesekan lembut saat kertas diseret di meja (loopable / 0.3s).
* `paper_land.mp3`: Suara ketukan empuk saat kertas mendarat di meja kayu (0.12s).
* `tape_snap.mp3`: Suara klik rekat selotip/lem saat huruf menempel ke slot (0.2s).
* `peel_stick.mp3`: Suara stiker dikelupas dari laci dan ditekan merekat (0.25s).
* `celebration_fanfare.mp3`: Melodi terompet ceria saat kata selesai dirangkai (1.8s).
* `applause_cheer.mp3`: Suara tepuk tangan riang anak-anak (1.5s).

#### 2. Suara Karakter & Habitat Diorama (`audio/actions/`):
* `meow.mp3`: Suara anak kucing mengeong ramah (*meoow*).
* `vroom.mp3`: Suara mobil mainan melaju dan klakson ceria (*brum brum tin!*).
* `splash.mp3`: Suara kecipak air segar dan gelembung berenang.
* `crunch.mp3`: Suara gigitan apel renyah (*krupuk!*).
* `bounce.mp3`: Suara bola membal gembira (*boing!*).
* `quack.mp3`: Suara bebek berenang (*kwek kwek!*).
* `roar.mp3`: Suara auman singa kecil yang lucu (*raawrr!*).
* `twinkle.mp3`: Suara lonceng peri gemerlap bintang (*chime chime*).

---

## 🤖 4. Contoh Formula Prompt AI Image Generator

Jika membuat aset stiker atau background menggunakan AI (*Imagen, DALL-E, Midjourney*), gunakan formula prompt berikut agar konsisten dengan gaya papercraft aplikasi:

### Prompt untuk Stiker Die-Cut Transparan:
```text
A cute die-cut papercraft sticker of [OBJEK/HEWAN, misal: a playful kitten playing with a yarn ball], isolated on a pure solid white background. Handcrafted paper collage art style, visible paper cutout layers, pastel vibrant colors, thick white sticker border outline around the character, clean edges, playful doodle detailing, high resolution, suitable for a children educational mobile game sticker scrapbook.
```

### Prompt untuk Latar Panorama Diorama:
```text
A panoramic 16:9 children diorama landscape backdrop in layered papercraft collage art style. Seamless blend of [ZONA, misal: a lush rolling green paper meadow with layered paper hills, stylized paper tree with apples, and gentle blue stream]. Handcrafted tactile torn paper edges, soft subtle ambient shadows between layers, warm pastel color palette, cheerful clean aesthetic for a kids educational app, no characters, empty scenery ready for stickers.
```

---

## 📈 5. Tahapan Eksekusi Peningkatan Aset

1. **Tahap 1 (Prioritas):** Konversi 12 gambar kata saat ini menjadi **stiker berlatar transparan die-cut (PNG)** agar saat ditempel di panorama tidak menyisakan kotak putih kaku.
2. **Tahap 2:** Penerapan gambar latar panorama resolusi tinggi (`bg_panorama_full.webp`) untuk menggantikan bentuk CSS geometris sederhana.
3. **Tahap 3:** Penggantian sintesis Web Audio dengan rekaman audio fisik berkualitas tinggi (`.mp3`) untuk suara kertas dan karakter diorama.
4. **Tahap 4:** Penambahan paket kata dan stiker baru (Dinosaurus, Tata Surya, Hewan Laut).
