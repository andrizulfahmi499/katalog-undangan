# Bugfix Requirements Document

## Introduction

Landing page https://katalog-id.vercel.app/ mengalami delay signifikan saat diakses dengan koneksi internet aktif, namun langsung terbuka saat offline. Bug ini disebabkan oleh database query sinkron di fungsi `generateMetadata()` dalam file `src/app/layout.tsx` yang melakukan blocking call untuk mengambil favicon dari database. Query ini memblokir rendering halaman, menyebabkan Time to First Byte (TTFB) yang lambat dan pengalaman pengguna yang buruk, terutama saat database query membutuhkan waktu lama.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN landing page diakses dengan koneksi internet aktif THEN sistem melakukan blocking database query di `generateMetadata()` yang menyebabkan delay signifikan sebelum halaman mulai render

1.2 WHEN database query untuk favicon membutuhkan waktu lama (slow database response) THEN sistem menunggu query selesai sebelum mengirim response ke browser, menyebabkan TTFB yang sangat lambat

1.3 WHEN koneksi internet dimatikan THEN database query gagal dengan cepat (immediate connection timeout), fallback ke default favicon `/favicon-rose.svg` terjadi segera, dan halaman langsung render tanpa delay

### Expected Behavior (Correct)

2.1 WHEN landing page diakses dengan koneksi internet aktif THEN sistem SHALL menggunakan static default favicon di metadata tanpa melakukan database query yang blocking

2.2 WHEN `generateMetadata()` dipanggil THEN sistem SHALL return metadata dengan favicon default secara sinkron tanpa menunggu database query

2.3 WHEN halaman landing page di-render THEN sistem SHALL menampilkan halaman dengan cepat (fast TTFB) tanpa delay yang disebabkan oleh database query

### Unchanged Behavior (Regression Prevention)

3.1 WHEN metadata lain (title, description, keywords, openGraph, twitter) di-generate THEN sistem SHALL CONTINUE TO menghasilkan metadata yang sama seperti sebelumnya

3.2 WHEN favicon default `/favicon-rose.svg` digunakan THEN sistem SHALL CONTINUE TO menampilkan favicon yang sama seperti saat fallback terjadi

3.3 WHEN layout component di-render THEN sistem SHALL CONTINUE TO menampilkan semua elemen UI (Navbar, ThemeProvider, Toaster, dll) dengan behavior yang sama

3.4 WHEN font loading (Geist, Geist_Mono, Playfair_Display) terjadi THEN sistem SHALL CONTINUE TO menggunakan konfigurasi font yang sama dengan `display: 'swap'` dan preload settings

3.5 WHEN external scripts (lordicon, model-viewer) di-load THEN sistem SHALL CONTINUE TO defer loading hingga setelah page load event
