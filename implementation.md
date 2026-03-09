# Dokumen Implementasi Sistem & Alur Kerja (Workflow)
**Sistem Manajemen Inventaris & Penjualan Multi-Cabang**

## 1. Pendahuluan
Dokumen ini merincikan alur kerja (*workflow*) dari aplikasi manajemen inventaris dan penjualan yang dirancang untuk mendukung operasional bisnis dari hulu (Gudang Pusat) ke hilir (Toko Cabang). Sistem ini dirancang untuk memastikan transparansi stok, pelacakan distribusi barang, pencatatan penjualan harian yang akurat, serta kemudahan dalam mengawasi barang retur secara *real-time*.

## 2. Hak Akses & Pembagian Tugas (Roles)
Sistem membagi pengguna ke dalam 3 (tiga) peran utama untuk menjaga privasi, keamanan, dan keakuratan data:

1. **OWNER (Pemilik Perusahaan):** 
   Memiliki hak akses tertinggi. Dapat melihat dasbor analitik, seluruh laporan penjualan, mutasi/pergerakan stok, dan ringkasan distribusi dari semua cabang. Owner difokuskan pada pengawasan dan pengambilan keputusan strategis.
2. **ADMIN (Pengelola Pusat):** 
   Bertugas sebagai pelaksana manajerial utama. Admin berwenang mengelola *Master Data* (Toko, Kategori), membuatkan akun Kasir, mencatat ketersediaan barang di gudang pusat, serta mengeksekusi dan memantau perpindahan distribusi barang ke toko cabang.
3. **KASIR (Petugas Toko Cabang):** 
   Mengoperasikan sistem di garda terdepan (level cabang tertentu). Akses Kasir dibatasi *hanya* untuk melihat data stok cabang miliknya sendiri, mencetak laporan penjualan harian, dan mengajukan retur barang (barang rusak/tak laku) ke pusat.

---

## 3. Rincian Alur Kerja Utama (Core Workflows)

### A. Alur Pengelolaan Data Master & Pengguna (Setup Awal)
*Tahap fundamental sebelum sistem beroperasi digunakan oleh cabang.*
1. **Pendaftaran Toko/Gudang:** Admin mendata seluruh entitas fisik (Toko Cabang) ke dalam sistem dan menandai satu lokasi khusus sebagai **Gudang Pusat**.
2. **Manajemen Kategori:** Admin membuat dan mendata jenis-jenis atau kategori produk yang dijual oleh perusahaan. Item stok akan diikat pada kategori ini.
3. **Pembuatan Akun Karyawan:** Admin membuat kredensial *login* untuk para Kasir. Sistem akan secara otomatis mengunci (binding) satu akun Kasir secara spesifik ke satu Toko Cabang. Hal ini mencegah kasir mengintip pundi-pundi uang atau stok cabang lain.

### B. Alur Manajemen Stok & Distribusi (Supply Chain Pusat -> Cabang)
*Mengatur tahapan alokasi barang agar tidak ada selisih stok (loss/shrinkage).*
1. **Penambahan Modal Stok di Pusat:** Barang dari *supplier* eksternal tiba dan dicatatkan ke database Gudang Pusat (diinput beserta harga modal/HPP).
2. **Instruksi Pengiriman Distribusi:** Admin di pusat membuat Instruksi Distribusi melalui sistem untuk mentransfer kuantitas barang ke Toko Cabang spesifik.
3. **Tracking Status Distribusi:** Perjalanan barang diawasi dengan 3 status:
   - **PENDING:** Barang sedang dipersiapkan di gudang (belum jalan).
   - **DIKIRIM:** Barang telah dimuat dan sedang dalam perjalanan kurir/logistik.
   - **DITERIMA:** Barang telah tiba secara fisik di cabang.
4. **Mutasi Stok Otomatis:** Begitu status dikonfirmasi menjadi "DITERIMA" baik oleh Admin maupun Kasir penerima, sistem otomasi akan mengurangi angka stok di Gudang Pusat dan menambah pelaporan stok di Toko Cabang detik itu juga (*real-time*).

### C. Alur Pencatatan Penjualan Harian (Operasi Kasir Cabang)
*Alur konversi dari barang menjadi uang, mencatat pemasukan harian toko cabang.*
1. **Input Penjualan:** Saat tutup buku, Kasir cabang mencatatkan laporan barang yang terjual. Kasir memasukkan jumlah kuantitas (*qty*) dan harga jual satuan aktual.
2. **Pengurangan Stok Otomatis:** Ketika penjualan disubmit, jumlah stok fisik terkait di Toko Cabang tersebut secara otomatis berkurang tanpa perlu menghitung ulang gudang.
3. **Audit Transaksi & Profit:** Sistem akan mengkalkulasi total uang (*gross revenue*). Karena sistem juga mengetahui Harga Modal stok, laba kotor (*gross profit*) dapat langsung divisualisasikan untuk laporan *Owner*.
4. **Monitoring Pemilik:** Riwayat penjualan tercatat mutlak mencakup waktu (tanggal persis) beserta nama Kasir pembuat laporan, mendisiplinkan petugas cabang.

### D. Alur Retur Barang (Tarik Mundur Cabang -> Pusat)
*SOP penanganan barang kedaluwarsa, cacat pabrik, atau perputaran lambat (dead-stock).*
1. **Pengajuan Pengembalian:** Kasir cabang mengajukan permohonan "Retur" melalui sistem (lengkap dengan jumlah *qty* dan alasan tertulis).
2. **Status Awal:** Dokumen Retur masuk dengan status **PENDING** (Menunggu persetujuan pusat).
3. **Verifikasi & Approval Admin:** Admin di gudang pusat menerima barang fisik dan mencocokkannya dengan request sistem untuk verifikasi. 
4. **Resolusi Akhir:**
   - **DISETUJUI:** Sistem secara matematis akan mengurangi stok toko cabang dan mengembalikannya ke sistem stok Gudang Pusat otomatis.
   - **DITOLAK:** Pengajuan dianggap tidak valid (misal: kondisi barang tidak memenuhi syarat retur perusahaan) dan dibatalkan, angka stok tidak berubah.

---

## 4. Pondasi Arsitektur IT (Sekilas Teknologi Sistem)
*Mengapa sistem ini tangguh untuk skalabilitas bisnis di masa depan.*
- **Terpusat di Cloud Web:** Menggunakan teknologi SvelteKit terkini. Tidak ada aplikasi yang perlu di-*install* di komputer pegawai, cukup buka *browser*. Data terpusat, *update* terjadi bersamaan.
- **Relasional Database Kuat (PostgreSQL):** Standar enterprise yang menjamin ACID-Compliance, artinya tidak akan pernah ada celah database untuk kehilangan data transaksi penting saat pemadaman listrik tau koneksi terputus. Validitas pelaporan uang aman 100%.
- **Keamanan Lapis Baja & Performa Tingkat Tinggi:** Dibangun di atas *TypeScript* untuk standardisasi *strict logic* sehingga menjamin aplikasi yang terbebas dari malfungsi (*bug-free*) serta *Bun Runtime Engine* yang mempercepat pengolahan data distribusi berat.

## Kesimpulan Eksekutif
Implementasi piranti lunak digitalisasi ini menggantikan risiko human-error dari pencatatan tradisional (Kertas/Excel) dengan alur operasional otomasi tersentralisasi (Pusat ke Cabang). Hal ini mendatangkan efisiensi inventaris, dan memberikan *Owner* kemampuan visibilitas serta kontrol absolut dalam memantau kebocoran uang atau aset perusahaan di lapangan dengan segera.
