// Export utility functions for PDF and Excel generation

export async function exportRingkasanPDF(reportData: any, filterPeriode: string, customStartDate: string, customEndDate: string) {
    try {
        console.log('Starting PDF export with data:', reportData);
        
        // Dynamic import untuk mengurangi bundle size
        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');

        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(20);
        doc.setTextColor(48, 102, 119);
        doc.text('IMD Clothes', 14, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(95, 107, 111);
        doc.text('CV. Inti Media Digital', 14, 26);
        
        doc.setFontSize(16);
        doc.setTextColor(44, 52, 55);
        doc.text('Laporan Ringkasan Eksekutif', 14, 40);
        
        // Periode
        const startDate = new Date(reportData.data.periode.start);
        const endDate = new Date(reportData.data.periode.end);
        doc.setFontSize(10);
        doc.setTextColor(95, 107, 111);
        doc.text(`Periode: ${startDate.toLocaleDateString('id-ID')} - ${endDate.toLocaleDateString('id-ID')}`, 14, 47);
        doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`, 14, 52);
        
        let yPos = 60;
        
        // KPI Summary
        doc.setFontSize(12);
        doc.setTextColor(44, 52, 55);
        doc.text('Ringkasan KPI', 14, yPos);
        yPos += 8;
        
        const kpiData = [
            ['Total Stok Gudang Pusat', `${reportData.data.ringkasan.totalStokPusat.toLocaleString('id-ID')} unit`],
            ['Total Cabang Toko', `${reportData.data.ringkasan.totalTokoCabang} toko`],
            ['Total Pendapatan', formatRupiah(reportData.data.ringkasan.totalPendapatan)],
            ['Total Penjualan', `${reportData.data.ringkasan.totalPenjualan} transaksi`],
            ['Pengiriman Aktif', `${reportData.data.ringkasan.pengirimanAktif} pengiriman`],
            ['Pending Retur', `${reportData.data.ringkasan.pendingRetur} permintaan`]
        ];
        
        autoTable(doc, {
            startY: yPos,
            head: [['Metrik', 'Nilai']],
            body: kpiData,
            theme: 'grid',
            headStyles: { fillColor: [48, 102, 119], textColor: 255 },
            styles: { fontSize: 9 }
        });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;
    
    // Top Products
    if (reportData.data.popularProducts.length > 0) {
        doc.setFontSize(12);
        doc.setTextColor(44, 52, 55);
        doc.text('Produk Terlaris', 14, yPos);
        yPos += 8;
        
        const productData = reportData.data.popularProducts.map((p: any, i: number) => [
            i + 1,
            p.nama,
            `${p.quantity} pcs`,
            formatRupiah(p.revenue)
        ]);
        
        autoTable(doc, {
            startY: yPos,
            head: [['#', 'Produk', 'Qty Terjual', 'Revenue']],
            body: productData,
            theme: 'striped',
            headStyles: { fillColor: [48, 102, 119], textColor: 255 },
            styles: { fontSize: 9 }
        });
        
        yPos = (doc as any).lastAutoTable.finalY + 10;
    }
    
    // Low Stock Alert
    if (reportData.data.lowStockItems.length > 0 && yPos < 250) {
        doc.setFontSize(12);
        doc.setTextColor(44, 52, 55);
        doc.text('Stok Menipis (< 15 unit)', 14, yPos);
        yPos += 8;
        
        const lowStockData = reportData.data.lowStockItems.map((item: any) => [
            item.kategori.nama_kategori,
            item.toko.nama_toko,
            `${item.jumlah} unit`
        ]);
        
        autoTable(doc, {
            startY: yPos,
            head: [['Kategori', 'Toko', 'Stok']],
            body: lowStockData,
            theme: 'striped',
            headStyles: { fillColor: [220, 38, 38], textColor: 255 },
            styles: { fontSize: 9 }
        });
    }
    
    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
            `Halaman ${i} dari ${pageCount}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
        );
    }
    
    // Save PDF
    doc.save(`Ringkasan-Eksekutif-${new Date().getTime()}.pdf`);
    
    console.log('PDF export completed successfully');
    } catch (error) {
        console.error('Error in exportRingkasanPDF:', error);
        throw error;
    }
}

export async function exportRingkasanExcel(reportData: any) {
    try {
        console.log('Starting Excel export with data:', reportData);
        
        // Dynamic import ExcelJS
        const ExcelJS = await import('exceljs');
        
        // Create workbook
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'IMD Clothes';
        workbook.created = new Date();
        
        // ===== SHEET 1: RINGKASAN KPI =====
        const sheet1 = workbook.addWorksheet('Ringkasan', {
            properties: { tabColor: { argb: 'FF306677' } }
        });
        
        // Header
        sheet1.mergeCells('A1:B1');
        const titleCell = sheet1.getCell('A1');
        titleCell.value = 'LAPORAN RINGKASAN EKSEKUTIF';
        titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FF306677' } };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        
        sheet1.mergeCells('A2:B2');
        const subtitleCell = sheet1.getCell('A2');
        subtitleCell.value = 'IMD Clothes - CV. Inti Media Digital';
        subtitleCell.font = { name: 'Calibri', size: 11, color: { argb: 'FF5f6b6f' } };
        subtitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        
        // Periode
        sheet1.getCell('A4').value = 'Periode';
        sheet1.getCell('B4').value = `${new Date(reportData.data.periode.start).toLocaleDateString('id-ID')} - ${new Date(reportData.data.periode.end).toLocaleDateString('id-ID')}`;
        sheet1.getCell('A5').value = 'Dicetak';
        sheet1.getCell('B5').value = `${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`;
        
        // Section Title
        sheet1.mergeCells('A7:B7');
        const sectionTitle = sheet1.getCell('A7');
        sectionTitle.value = 'RINGKASAN KPI';
        sectionTitle.font = { name: 'Calibri', size: 12, bold: true };
        sectionTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFd1e4ea' } };
        sectionTitle.alignment = { horizontal: 'center', vertical: 'middle' };
        
        // Table Header
        sheet1.getCell('A8').value = 'Metrik';
        sheet1.getCell('B8').value = 'Nilai';
        ['A8', 'B8'].forEach(cell => {
            const c = sheet1.getCell(cell);
            c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF306677' } };
            c.alignment = { horizontal: 'center', vertical: 'middle' };
            c.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
        
        // Table Data
        const kpiData = [
            ['Total Stok Gudang Pusat', `${reportData.data.ringkasan.totalStokPusat.toLocaleString('id-ID')} unit`],
            ['Total Cabang Toko', `${reportData.data.ringkasan.totalTokoCabang} toko`],
            ['Total Pendapatan', reportData.data.ringkasan.totalPendapatan],
            ['Total Penjualan', `${reportData.data.ringkasan.totalPenjualan} transaksi`],
            ['Pengiriman Aktif', `${reportData.data.ringkasan.pengirimanAktif} pengiriman`],
            ['Pending Retur', `${reportData.data.ringkasan.pendingRetur} permintaan`]
        ];
        
        kpiData.forEach((row, idx) => {
            const rowNum = 9 + idx;
            sheet1.getCell(`A${rowNum}`).value = row[0];
            sheet1.getCell(`B${rowNum}`).value = row[1];
            
            // Format currency for Total Pendapatan
            if (idx === 2) {
                sheet1.getCell(`B${rowNum}`).numFmt = 'Rp #,##0';
            }
            
            // Add borders
            ['A', 'B'].forEach(col => {
                const cell = sheet1.getCell(`${col}${rowNum}`);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                // Alternate row colors
                if (idx % 2 === 0) {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf7f9fb' } };
                }
            });
        });
        
        // Column widths
        sheet1.getColumn('A').width = 30;
        sheet1.getColumn('B').width = 25;
        
        // ===== SHEET 2: PRODUK TERLARIS =====
        if (reportData.data.popularProducts.length > 0) {
            const sheet2 = workbook.addWorksheet('Produk Terlaris', {
                properties: { tabColor: { argb: 'FF306677' } }
            });
            
            // Title
            sheet2.mergeCells('A1:D1');
            const title2 = sheet2.getCell('A1');
            title2.value = 'PRODUK TERLARIS';
            title2.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FF306677' } };
            title2.alignment = { horizontal: 'center', vertical: 'middle' };
            
            // Table Header
            const headers = ['#', 'Nama Produk', 'Qty Terjual', 'Revenue (Rp)'];
            headers.forEach((header, idx) => {
                const cell = sheet2.getCell(3, idx + 1);
                cell.value = header;
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF306677' } };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
            
            // Table Data
            reportData.data.popularProducts.forEach((p: any, idx: number) => {
                const rowNum = 4 + idx;
                sheet2.getCell(`A${rowNum}`).value = idx + 1;
                sheet2.getCell(`B${rowNum}`).value = p.nama;
                sheet2.getCell(`C${rowNum}`).value = p.quantity;
                sheet2.getCell(`D${rowNum}`).value = p.revenue;
                sheet2.getCell(`D${rowNum}`).numFmt = '"Rp "#,##0';
                
                // Add borders and alternate colors
                ['A', 'B', 'C', 'D'].forEach(col => {
                    const cell = sheet2.getCell(`${col}${rowNum}`);
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    if (idx % 2 === 0) {
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf7f9fb' } };
                    }
                });
                
                // Center align number columns
                sheet2.getCell(`A${rowNum}`).alignment = { horizontal: 'center' };
                sheet2.getCell(`C${rowNum}`).alignment = { horizontal: 'center' };
            });
            
            // Total Row
            const totalRow = 4 + reportData.data.popularProducts.length;
            sheet2.getCell(`A${totalRow}`).value = 'TOTAL';
            sheet2.getCell(`B${totalRow}`).value = '';
            sheet2.getCell(`C${totalRow}`).value = reportData.data.popularProducts.reduce((sum: number, p: any) => sum + p.quantity, 0);
            sheet2.getCell(`D${totalRow}`).value = reportData.data.popularProducts.reduce((sum: number, p: any) => sum + p.revenue, 0);
            sheet2.getCell(`D${totalRow}`).numFmt = '"Rp "#,##0';
            
            ['A', 'B', 'C', 'D'].forEach(col => {
                const cell = sheet2.getCell(`${col}${totalRow}`);
                cell.font = { bold: true };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFd1e4ea' } };
                cell.border = {
                    top: { style: 'medium' },
                    left: { style: 'thin' },
                    bottom: { style: 'medium' },
                    right: { style: 'thin' }
                };
            });
            
            // Column widths
            sheet2.getColumn('A').width = 5;
            sheet2.getColumn('B').width = 35;
            sheet2.getColumn('C').width = 15;
            sheet2.getColumn('D').width = 22; // Diperlebar untuk currency format
        }
        
        // ===== SHEET 3: STOK MENIPIS =====
        if (reportData.data.lowStockItems.length > 0) {
            const sheet3 = workbook.addWorksheet('Stok Menipis', {
                properties: { tabColor: { argb: 'FFDC2626' } }
            });
            
            // Title
            sheet3.mergeCells('A1:C1');
            const title3 = sheet3.getCell('A1');
            title3.value = 'STOK MENIPIS (< 15 UNIT)';
            title3.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFDC2626' } };
            title3.alignment = { horizontal: 'center', vertical: 'middle' };
            
            // Table Header
            const headers3 = ['Kategori', 'Toko', 'Stok Tersisa'];
            headers3.forEach((header, idx) => {
                const cell = sheet3.getCell(3, idx + 1);
                cell.value = header;
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDC2626' } };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
            
            // Table Data
            reportData.data.lowStockItems.forEach((item: any, idx: number) => {
                const rowNum = 4 + idx;
                sheet3.getCell(`A${rowNum}`).value = item.kategori.nama_kategori;
                sheet3.getCell(`B${rowNum}`).value = item.toko.nama_toko;
                sheet3.getCell(`C${rowNum}`).value = item.jumlah;
                
                // Add borders and alternate colors
                ['A', 'B', 'C'].forEach(col => {
                    const cell = sheet3.getCell(`${col}${rowNum}`);
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    if (idx % 2 === 0) {
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFfef2f2' } };
                    }
                });
                
                // Center align stock column
                sheet3.getCell(`C${rowNum}`).alignment = { horizontal: 'center' };
                
                // Highlight very low stock (< 5)
                if (item.jumlah < 5) {
                    sheet3.getCell(`C${rowNum}`).font = { bold: true, color: { argb: 'FFDC2626' } };
                }
            });
            
            // Column widths
            sheet3.getColumn('A').width = 30;
            sheet3.getColumn('B').width = 30;
            sheet3.getColumn('C').width = 15;
        }
        
        // ===== SHEET 4: TREN PENJUALAN =====
        if (reportData.data.salesByDay.length > 0) {
            const sheet4 = workbook.addWorksheet('Tren Penjualan', {
                properties: { tabColor: { argb: 'FF306677' } }
            });
            
            // Title
            sheet4.mergeCells('A1:C1');
            const title4 = sheet4.getCell('A1');
            title4.value = 'TREN PENJUALAN HARIAN';
            title4.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FF306677' } };
            title4.alignment = { horizontal: 'center', vertical: 'middle' };
            
            // Table Header
            const headers4 = ['Tanggal', 'Total Penjualan (Rp)', 'Qty Terjual'];
            headers4.forEach((header, idx) => {
                const cell = sheet4.getCell(3, idx + 1);
                cell.value = header;
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF306677' } };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
            
            // Table Data
            reportData.data.salesByDay.forEach((day: any, idx: number) => {
                const rowNum = 4 + idx;
                sheet4.getCell(`A${rowNum}`).value = new Date(day.tanggal).toLocaleDateString('id-ID');
                sheet4.getCell(`B${rowNum}`).value = day._sum.total_uang || 0;
                sheet4.getCell(`B${rowNum}`).numFmt = '"Rp "#,##0';
                sheet4.getCell(`C${rowNum}`).value = day._sum.qty_terjual || 0;
                
                // Add borders and alternate colors
                ['A', 'B', 'C'].forEach(col => {
                    const cell = sheet4.getCell(`${col}${rowNum}`);
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    if (idx % 2 === 0) {
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf7f9fb' } };
                    }
                });
                
                // Center align qty column
                sheet4.getCell(`C${rowNum}`).alignment = { horizontal: 'center' };
            });
            
            // Total Row
            const totalRow4 = 4 + reportData.data.salesByDay.length;
            sheet4.getCell(`A${totalRow4}`).value = 'TOTAL';
            sheet4.getCell(`B${totalRow4}`).value = reportData.data.salesByDay.reduce((sum: number, d: any) => sum + (d._sum.total_uang || 0), 0);
            sheet4.getCell(`B${totalRow4}`).numFmt = '"Rp "#,##0';
            sheet4.getCell(`C${totalRow4}`).value = reportData.data.salesByDay.reduce((sum: number, d: any) => sum + (d._sum.qty_terjual || 0), 0);
            
            ['A', 'B', 'C'].forEach(col => {
                const cell = sheet4.getCell(`${col}${totalRow4}`);
                cell.font = { bold: true };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFd1e4ea' } };
                cell.border = {
                    top: { style: 'medium' },
                    left: { style: 'thin' },
                    bottom: { style: 'medium' },
                    right: { style: 'thin' }
                };
            });
            
            // Column widths
            sheet4.getColumn('A').width = 20;
            sheet4.getColumn('B').width = 28; // Diperlebar untuk currency format
            sheet4.getColumn('C').width = 15;
        }
        
        // Save Excel
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Ringkasan-Eksekutif-${new Date().getTime()}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
        
        console.log('Excel export completed successfully');
    } catch (error) {
        console.error('Error in exportRingkasanExcel:', error);
        throw error;
    }
}

function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}


export async function exportStokPusatPDF(reportData: any) {
    try {
        
        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');

        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(20);
        doc.setTextColor(48, 102, 119);
        doc.text('IMD Clothes', 14, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(95, 107, 111);
        doc.text('CV. Inti Media Digital', 14, 26);
        
        doc.setFontSize(16);
        doc.setTextColor(44, 52, 55);
        doc.text('Laporan Stok Gudang Pusat', 14, 40);
        
        // Info Gudang
        doc.setFontSize(10);
        doc.setTextColor(95, 107, 111);
        doc.text(`Gudang: ${reportData.data.gudangPusat.nama}`, 14, 47);
        doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`, 14, 52);
        
        let yPos = 60;
        
        // Ringkasan
        doc.setFontSize(12);
        doc.setTextColor(44, 52, 55);
        doc.text('Ringkasan Stok', 14, yPos);
        yPos += 8;
        
        const ringkasanData = [
            ['Total Kategori Produk', `${reportData.data.ringkasan.totalKategori} kategori`],
            ['Total Unit Stok', `${reportData.data.ringkasan.totalUnit.toLocaleString('id-ID')} unit`],
            ['Total Nilai Modal', formatRupiah(reportData.data.ringkasan.totalNilaiModal)],
            ['Stok Menipis (< 15 unit)', `${reportData.data.ringkasan.jumlahStokMenipis} kategori`]
        ];
        
        autoTable(doc, {
            startY: yPos,
            head: [['Metrik', 'Nilai']],
            body: ringkasanData,
            theme: 'grid',
            headStyles: { fillColor: [48, 102, 119], textColor: 255 },
            styles: { fontSize: 9 }
        });
        
        yPos = (doc as any).lastAutoTable.finalY + 10;
        
        // Stok Per Kategori
        doc.setFontSize(12);
        doc.setTextColor(44, 52, 55);
        doc.text('Stok Per Kategori', 14, yPos);
        yPos += 8;
        
        const stokData = reportData.data.stokPerKategori.map((item: any) => [
            item.kategori,
            item.jumlah,
            formatRupiah(item.hargaModal),
            formatRupiah(item.nilaiTotal),
            item.status
        ]);
        
        autoTable(doc, {
            startY: yPos,
            head: [['Kategori', 'Stok', 'Harga Modal', 'Nilai Total', 'Status']],
            body: stokData,
            theme: 'striped',
            headStyles: { fillColor: [48, 102, 119], textColor: 255 },
            styles: { fontSize: 8 },
            columnStyles: {
                1: { halign: 'center' },
                4: { halign: 'center' }
            },
            didParseCell: function(data: any) {
                if (data.section === 'body' && data.column.index === 4) {
                    const status = data.cell.raw;
                    if (status === 'Kritis') {
                        data.cell.styles.textColor = [220, 38, 38];
                        data.cell.styles.fontStyle = 'bold';
                    } else if (status === 'Menipis') {
                        data.cell.styles.textColor = [245, 158, 11];
                        data.cell.styles.fontStyle = 'bold';
                    }
                }
            }
        });
        
        // Add new page if needed for low stock
        if (reportData.data.stokMenipis.length > 0) {
            doc.addPage();
            yPos = 20;
            
            doc.setFontSize(12);
            doc.setTextColor(220, 38, 38);
            doc.text('Stok Menipis (< 15 Unit)', 14, yPos);
            yPos += 8;
            
            const lowStockData = reportData.data.stokMenipis.map((item: any) => [
                item.kategori,
                item.jumlah,
                formatRupiah(item.hargaModal)
            ]);
            
            autoTable(doc, {
                startY: yPos,
                head: [['Kategori', 'Stok Tersisa', 'Harga Modal']],
                body: lowStockData,
                theme: 'striped',
                headStyles: { fillColor: [220, 38, 38], textColor: 255 },
                styles: { fontSize: 9 },
                columnStyles: {
                    1: { halign: 'center', textColor: [220, 38, 38], fontStyle: 'bold' }
                }
            });
        }
        
        // Footer
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(
                `Halaman ${i} dari ${pageCount}`,
                doc.internal.pageSize.width / 2,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }
        
        doc.save(`Stok-Gudang-Pusat-${new Date().getTime()}.pdf`);
        
        console.log('Stok Pusat PDF export completed successfully');
    } catch (error) {
        console.error('Error in exportStokPusatPDF:', error);
        throw error;
    }
}

export async function exportStokPusatExcel(reportData: any) {
    try {
        
        const ExcelJS = await import('exceljs');
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'IMD Clothes';
        workbook.created = new Date();
        
        // ===== SHEET 1: RINGKASAN & STOK PER KATEGORI =====
        const sheet1 = workbook.addWorksheet('Stok Gudang Pusat', {
            properties: { tabColor: { argb: 'FF306677' } }
        });
        
        // Title
        sheet1.mergeCells('A1:E1');
        const titleCell = sheet1.getCell('A1');
        titleCell.value = 'LAPORAN STOK GUDANG PUSAT';
        titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FF306677' } };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        
        sheet1.mergeCells('A2:E2');
        const subtitleCell = sheet1.getCell('A2');
        subtitleCell.value = 'IMD Clothes - CV. Inti Media Digital';
        subtitleCell.font = { name: 'Calibri', size: 11, color: { argb: 'FF5f6b6f' } };
        subtitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        
        // Info
        sheet1.getCell('A4').value = 'Gudang';
        sheet1.getCell('B4').value = reportData.data.gudangPusat.nama;
        sheet1.getCell('A5').value = 'Dicetak';
        sheet1.getCell('B5').value = `${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`;
        
        // Ringkasan Section
        sheet1.mergeCells('A7:E7');
        const ringkasanTitle = sheet1.getCell('A7');
        ringkasanTitle.value = 'RINGKASAN STOK';
        ringkasanTitle.font = { name: 'Calibri', size: 12, bold: true };
        ringkasanTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFd1e4ea' } };
        ringkasanTitle.alignment = { horizontal: 'center', vertical: 'middle' };
        
        // Ringkasan Data
        const ringkasanData = [
            ['Total Kategori Produk', `${reportData.data.ringkasan.totalKategori} kategori`],
            ['Total Unit Stok', `${reportData.data.ringkasan.totalUnit.toLocaleString('id-ID')} unit`],
            ['Total Nilai Modal', reportData.data.ringkasan.totalNilaiModal],
            ['Stok Menipis (< 15 unit)', `${reportData.data.ringkasan.jumlahStokMenipis} kategori`]
        ];
        
        ringkasanData.forEach((row, idx) => {
            const rowNum = 8 + idx;
            sheet1.getCell(`A${rowNum}`).value = row[0];
            sheet1.getCell(`B${rowNum}`).value = row[1];
            
            // Format currency untuk Total Nilai Modal
            if (idx === 2) {
                sheet1.getCell(`B${rowNum}`).numFmt = '"Rp "#,##0';
            }
            
            ['A', 'B'].forEach(col => {
                const cell = sheet1.getCell(`${col}${rowNum}`);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                if (idx % 2 === 0) {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf7f9fb' } };
                }
            });
        });
        
        // Stok Per Kategori Section
        sheet1.mergeCells('A13:E13');
        const stokTitle = sheet1.getCell('A13');
        stokTitle.value = 'STOK PER KATEGORI';
        stokTitle.font = { name: 'Calibri', size: 12, bold: true };
        stokTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFd1e4ea' } };
        stokTitle.alignment = { horizontal: 'center', vertical: 'middle' };
        
        // Table Header
        const headers = ['Kategori', 'Stok', 'Harga Modal', 'Nilai Total', 'Status'];
        headers.forEach((header, idx) => {
            const cell = sheet1.getCell(14, idx + 1);
            cell.value = header;
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF306677' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
        
        // Table Data
        reportData.data.stokPerKategori.forEach((item: any, idx: number) => {
            const rowNum = 15 + idx;
            sheet1.getCell(`A${rowNum}`).value = item.kategori;
            sheet1.getCell(`B${rowNum}`).value = item.jumlah;
            sheet1.getCell(`C${rowNum}`).value = item.hargaModal;
            sheet1.getCell(`D${rowNum}`).value = item.nilaiTotal;
            sheet1.getCell(`E${rowNum}`).value = item.status;
            
            // Format currency dengan format yang lebih sederhana
            sheet1.getCell(`C${rowNum}`).numFmt = '"Rp "#,##0';
            sheet1.getCell(`D${rowNum}`).numFmt = '"Rp "#,##0';
            
            ['A', 'B', 'C', 'D', 'E'].forEach(col => {
                const cell = sheet1.getCell(`${col}${rowNum}`);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                if (idx % 2 === 0) {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf7f9fb' } };
                }
            });
            
            // Center align
            sheet1.getCell(`B${rowNum}`).alignment = { horizontal: 'center' };
            sheet1.getCell(`E${rowNum}`).alignment = { horizontal: 'center' };
            
            // Color status
            const statusCell = sheet1.getCell(`E${rowNum}`);
            if (item.status === 'Kritis') {
                statusCell.font = { bold: true, color: { argb: 'FFDC2626' } };
            } else if (item.status === 'Menipis') {
                statusCell.font = { bold: true, color: { argb: 'FFF59E0B' } };
            } else {
                statusCell.font = { bold: true, color: { argb: 'FF10B981' } };
            }
        });
        
        // Total Row
        const totalRow = 15 + reportData.data.stokPerKategori.length;
        sheet1.getCell(`A${totalRow}`).value = 'TOTAL';
        sheet1.getCell(`B${totalRow}`).value = reportData.data.ringkasan.totalUnit;
        sheet1.getCell(`C${totalRow}`).value = '';
        sheet1.getCell(`D${totalRow}`).value = reportData.data.ringkasan.totalNilaiModal;
        sheet1.getCell(`D${totalRow}`).numFmt = '"Rp "#,##0';
        sheet1.getCell(`E${totalRow}`).value = '';
        
        ['A', 'B', 'C', 'D', 'E'].forEach(col => {
            const cell = sheet1.getCell(`${col}${totalRow}`);
            cell.font = { bold: true };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFd1e4ea' } };
            cell.border = {
                top: { style: 'medium' },
                left: { style: 'thin' },
                bottom: { style: 'medium' },
                right: { style: 'thin' }
            };
        });
        
        // Column widths
        sheet1.getColumn('A').width = 35;
        sheet1.getColumn('B').width = 30; // Diperlebar untuk currency format
        sheet1.getColumn('C').width = 20; // Diperlebar untuk currency format
        sheet1.getColumn('D').width = 20; // Diperlebar untuk currency format
        sheet1.getColumn('E').width = 12;
        
        // ===== SHEET 2: STOK MENIPIS =====
        if (reportData.data.stokMenipis.length > 0) {
            const sheet2 = workbook.addWorksheet('Stok Menipis', {
                properties: { tabColor: { argb: 'FFDC2626' } }
            });
            
            // Title
            sheet2.mergeCells('A1:C1');
            const title2 = sheet2.getCell('A1');
            title2.value = 'STOK MENIPIS (< 15 UNIT)';
            title2.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFDC2626' } };
            title2.alignment = { horizontal: 'center', vertical: 'middle' };
            
            // Table Header
            const headers2 = ['Kategori', 'Stok Tersisa', 'Harga Modal'];
            headers2.forEach((header, idx) => {
                const cell = sheet2.getCell(3, idx + 1);
                cell.value = header;
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDC2626' } };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
            
            // Table Data
            reportData.data.stokMenipis.forEach((item: any, idx: number) => {
                const rowNum = 4 + idx;
                sheet2.getCell(`A${rowNum}`).value = item.kategori;
                sheet2.getCell(`B${rowNum}`).value = item.jumlah;
                sheet2.getCell(`C${rowNum}`).value = item.hargaModal;
                sheet2.getCell(`C${rowNum}`).numFmt = '"Rp "#,##0';
                
                ['A', 'B', 'C'].forEach(col => {
                    const cell = sheet2.getCell(`${col}${rowNum}`);
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    if (idx % 2 === 0) {
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFfef2f2' } };
                    }
                });
                
                // Highlight critical stock
                const stokCell = sheet2.getCell(`B${rowNum}`);
                stokCell.alignment = { horizontal: 'center' };
                if (item.jumlah < 5) {
                    stokCell.font = { bold: true, color: { argb: 'FFDC2626' } };
                    stokCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFECACA' } };
                }
            });
            
            // Column widths
            sheet2.getColumn('A').width = 35;
            sheet2.getColumn('B').width = 15;
            sheet2.getColumn('C').width = 20; // Diperlebar untuk currency format
        }
        
        // Save Excel
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Stok-Gudang-Pusat-${new Date().getTime()}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
        
        console.log('Stok Pusat Excel export completed successfully');
    } catch (error) {
        console.error('Error in exportStokPusatExcel:', error);
        throw error;
    }
}

export async function exportPenjualanPDF(reportData: any) {
    try {
        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');

        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(20);
        doc.setTextColor(48, 102, 119);
        doc.text('IMD Clothes', 14, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(95, 107, 111);
        doc.text('CV. Inti Media Digital', 14, 26);
        
        doc.setFontSize(16);
        doc.setTextColor(44, 52, 55);
        doc.text('Laporan Penjualan', 14, 40);
        
        // Info
        const startDate = new Date(reportData.data.periode.start);
        const endDate = new Date(reportData.data.periode.end);
        doc.setFontSize(10);
        doc.setTextColor(95, 107, 111);
        doc.text(`Periode: ${startDate.toLocaleDateString('id-ID')} - ${endDate.toLocaleDateString('id-ID')}`, 14, 47);
        doc.text(`Toko: ${reportData.data.filter.toko}`, 14, 52);
        doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`, 14, 57);
        
        let yPos = 65;
        
        // Ringkasan
        doc.setFontSize(12);
        doc.setTextColor(44, 52, 55);
        doc.text('Ringkasan Penjualan', 14, yPos);
        yPos += 8;
        
        const ringkasanData = [
            ['Total Transaksi', `${reportData.data.ringkasan.totalTransaksi} transaksi`],
            ['Total Qty Terjual', `${reportData.data.ringkasan.totalQtyTerjual.toLocaleString('id-ID')} pcs`],
            ['Total Pendapatan', formatRupiah(reportData.data.ringkasan.totalPendapatan)]
        ];
        
        autoTable(doc, {
            startY: yPos,
            head: [['Metrik', 'Nilai']],
            body: ringkasanData,
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246], textColor: 255 },
            styles: { fontSize: 9 }
        });
        
        yPos = (doc as any).lastAutoTable.finalY + 10;
        
        // Penjualan Per Kategori
        if (reportData.data.salesByCategory.length > 0 && yPos < 240) {
            doc.setFontSize(12);
            doc.setTextColor(44, 52, 55);
            doc.text('Penjualan Per Kategori', 14, yPos);
            yPos += 8;
            
            const categoryData = reportData.data.salesByCategory.map((item: any, i: number) => [
                i + 1,
                item.kategori,
                `${item.qty} pcs`,
                formatRupiah(item.revenue)
            ]);
            
            autoTable(doc, {
                startY: yPos,
                head: [['#', 'Kategori', 'Qty', 'Revenue']],
                body: categoryData,
                theme: 'striped',
                headStyles: { fillColor: [59, 130, 246], textColor: 255 },
                styles: { fontSize: 9 }
            });
            
            yPos = (doc as any).lastAutoTable.finalY + 10;
        }
        
        // Detail Transaksi - tetap di halaman 1 jika masih muat
        if (reportData.data.penjualanList.length > 0) {
            // Cek apakah perlu halaman baru
            if (yPos > 240) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.setFontSize(12);
            doc.setTextColor(44, 52, 55);
            doc.text('Detail Transaksi Penjualan', 14, yPos);
            yPos += 8;
            
            const transactionData = reportData.data.penjualanList.slice(0, 50).map((item: any) => [
                new Date(item.tanggal).toLocaleDateString('id-ID'),
                item.kategori,
                item.toko,
                `${item.qty} pcs`,
                formatRupiah(item.total)
            ]);
            
            autoTable(doc, {
                startY: yPos,
                head: [['Tanggal', 'Kategori', 'Toko', 'Qty', 'Total']],
                body: transactionData,
                theme: 'striped',
                headStyles: { fillColor: [59, 130, 246], textColor: 255 },
                styles: { fontSize: 8 },
                columnStyles: {
                    0: { cellWidth: 25 },
                    1: { cellWidth: 40 },
                    2: { cellWidth: 35 },
                    3: { cellWidth: 20 },
                    4: { cellWidth: 30 }
                }
            });
        }
        
        // Footer
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(
                `Halaman ${i} dari ${pageCount}`,
                doc.internal.pageSize.width / 2,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }
        
        doc.save(`Laporan-Penjualan-${new Date().getTime()}.pdf`);
    } catch (error) {
        console.error('Error in exportPenjualanPDF:', error);
        throw error;
    }
}

export async function exportPenjualanExcel(reportData: any) {
    try {
        const ExcelJS = await import('exceljs');
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'IMD Clothes';
        workbook.created = new Date();
        
        // ===== SHEET 1: RINGKASAN =====
        const sheet1 = workbook.addWorksheet('Ringkasan', {
            properties: { tabColor: { argb: 'FF3B82F6' } }
        });
        
        // Title
        sheet1.mergeCells('A1:B1');
        const titleCell = sheet1.getCell('A1');
        titleCell.value = 'LAPORAN PENJUALAN';
        titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FF3B82F6' } };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        
        sheet1.mergeCells('A2:B2');
        const subtitleCell = sheet1.getCell('A2');
        subtitleCell.value = 'IMD Clothes - CV. Inti Media Digital';
        subtitleCell.font = { name: 'Calibri', size: 11, color: { argb: 'FF5f6b6f' } };
        subtitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        
        // Info
        sheet1.getCell('A4').value = 'Periode';
        sheet1.getCell('B4').value = `${new Date(reportData.data.periode.start).toLocaleDateString('id-ID')} - ${new Date(reportData.data.periode.end).toLocaleDateString('id-ID')}`;
        sheet1.getCell('A5').value = 'Toko';
        sheet1.getCell('B5').value = reportData.data.filter.toko;
        sheet1.getCell('A6').value = 'Dicetak';
        sheet1.getCell('B6').value = `${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`;
        
        // Ringkasan Section
        sheet1.mergeCells('A8:B8');
        const ringkasanTitle = sheet1.getCell('A8');
        ringkasanTitle.value = 'RINGKASAN PENJUALAN';
        ringkasanTitle.font = { name: 'Calibri', size: 12, bold: true };
        ringkasanTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFBFDBFE' } };
        ringkasanTitle.alignment = { horizontal: 'center', vertical: 'middle' };
        
        // Table Header
        sheet1.getCell('A9').value = 'Metrik';
        sheet1.getCell('B9').value = 'Nilai';
        ['A9', 'B9'].forEach(cell => {
            const c = sheet1.getCell(cell);
            c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3B82F6' } };
            c.alignment = { horizontal: 'center', vertical: 'middle' };
            c.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
        
        // Ringkasan Data
        const ringkasanData = [
            ['Total Transaksi', `${reportData.data.ringkasan.totalTransaksi} transaksi`],
            ['Total Qty Terjual', `${reportData.data.ringkasan.totalQtyTerjual.toLocaleString('id-ID')} pcs`],
            ['Total Pendapatan', reportData.data.ringkasan.totalPendapatan]
        ];
        
        ringkasanData.forEach((row, idx) => {
            const rowNum = 10 + idx;
            sheet1.getCell(`A${rowNum}`).value = row[0];
            sheet1.getCell(`B${rowNum}`).value = row[1];
            
            if (idx === 2) {
                sheet1.getCell(`B${rowNum}`).numFmt = '"Rp "#,##0';
            }
            
            ['A', 'B'].forEach(col => {
                const cell = sheet1.getCell(`${col}${rowNum}`);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                if (idx % 2 === 0) {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf7f9fb' } };
                }
            });
        });
        
        // Column widths
        sheet1.getColumn('A').width = 30;
        sheet1.getColumn('B').width = 30;
        
        // ===== SHEET 2: PENJUALAN PER KATEGORI =====
        if (reportData.data.salesByCategory.length > 0) {
            const sheet2 = workbook.addWorksheet('Per Kategori', {
                properties: { tabColor: { argb: 'FF3B82F6' } }
            });
            
            // Title
            sheet2.mergeCells('A1:D1');
            const title2 = sheet2.getCell('A1');
            title2.value = 'PENJUALAN PER KATEGORI';
            title2.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FF3B82F6' } };
            title2.alignment = { horizontal: 'center', vertical: 'middle' };
            
            // Table Header
            const headers2 = ['#', 'Kategori', 'Qty Terjual', 'Revenue (Rp)'];
            headers2.forEach((header, idx) => {
                const cell = sheet2.getCell(3, idx + 1);
                cell.value = header;
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3B82F6' } };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
            
            // Table Data
            reportData.data.salesByCategory.forEach((item: any, idx: number) => {
                const rowNum = 4 + idx;
                sheet2.getCell(`A${rowNum}`).value = idx + 1;
                sheet2.getCell(`B${rowNum}`).value = item.kategori;
                sheet2.getCell(`C${rowNum}`).value = item.qty;
                sheet2.getCell(`D${rowNum}`).value = item.revenue;
                sheet2.getCell(`D${rowNum}`).numFmt = '"Rp "#,##0';
                
                ['A', 'B', 'C', 'D'].forEach(col => {
                    const cell = sheet2.getCell(`${col}${rowNum}`);
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    if (idx % 2 === 0) {
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf7f9fb' } };
                    }
                });
                
                sheet2.getCell(`A${rowNum}`).alignment = { horizontal: 'center' };
                sheet2.getCell(`C${rowNum}`).alignment = { horizontal: 'center' };
            });
            
            // Total Row
            const totalRow2 = 4 + reportData.data.salesByCategory.length;
            sheet2.getCell(`A${totalRow2}`).value = 'TOTAL';
            sheet2.getCell(`B${totalRow2}`).value = '';
            sheet2.getCell(`C${totalRow2}`).value = reportData.data.salesByCategory.reduce((sum: number, item: any) => sum + item.qty, 0);
            sheet2.getCell(`D${totalRow2}`).value = reportData.data.salesByCategory.reduce((sum: number, item: any) => sum + item.revenue, 0);
            sheet2.getCell(`D${totalRow2}`).numFmt = '"Rp "#,##0';
            
            ['A', 'B', 'C', 'D'].forEach(col => {
                const cell = sheet2.getCell(`${col}${totalRow2}`);
                cell.font = { bold: true };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFBFDBFE' } };
                cell.border = {
                    top: { style: 'medium' },
                    left: { style: 'thin' },
                    bottom: { style: 'medium' },
                    right: { style: 'thin' }
                };
            });
            
            // Column widths
            sheet2.getColumn('A').width = 5;
            sheet2.getColumn('B').width = 35;
            sheet2.getColumn('C').width = 15;
            sheet2.getColumn('D').width = 22;
        }
        
        // ===== SHEET 3: PENJUALAN PER TOKO =====
        if (reportData.data.salesByToko.length > 0) {
            const sheet3 = workbook.addWorksheet('Per Toko', {
                properties: { tabColor: { argb: 'FF3B82F6' } }
            });
            
            // Title
            sheet3.mergeCells('A1:E1');
            const title3 = sheet3.getCell('A1');
            title3.value = 'PENJUALAN PER TOKO';
            title3.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FF3B82F6' } };
            title3.alignment = { horizontal: 'center', vertical: 'middle' };
            
            // Table Header
            const headers3 = ['#', 'Toko', 'Transaksi', 'Qty Terjual', 'Revenue (Rp)'];
            headers3.forEach((header, idx) => {
                const cell = sheet3.getCell(3, idx + 1);
                cell.value = header;
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3B82F6' } };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
            
            // Table Data
            reportData.data.salesByToko.forEach((item: any, idx: number) => {
                const rowNum = 4 + idx;
                sheet3.getCell(`A${rowNum}`).value = idx + 1;
                sheet3.getCell(`B${rowNum}`).value = item.toko;
                sheet3.getCell(`C${rowNum}`).value = item.transaksi;
                sheet3.getCell(`D${rowNum}`).value = item.qty;
                sheet3.getCell(`E${rowNum}`).value = item.revenue;
                sheet3.getCell(`E${rowNum}`).numFmt = '"Rp "#,##0';
                
                ['A', 'B', 'C', 'D', 'E'].forEach(col => {
                    const cell = sheet3.getCell(`${col}${rowNum}`);
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    if (idx % 2 === 0) {
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf7f9fb' } };
                    }
                });
                
                sheet3.getCell(`A${rowNum}`).alignment = { horizontal: 'center' };
                sheet3.getCell(`C${rowNum}`).alignment = { horizontal: 'center' };
                sheet3.getCell(`D${rowNum}`).alignment = { horizontal: 'center' };
            });
            
            // Total Row
            const totalRow3 = 4 + reportData.data.salesByToko.length;
            sheet3.getCell(`A${totalRow3}`).value = 'TOTAL';
            sheet3.getCell(`B${totalRow3}`).value = '';
            sheet3.getCell(`C${totalRow3}`).value = reportData.data.salesByToko.reduce((sum: number, item: any) => sum + item.transaksi, 0);
            sheet3.getCell(`D${totalRow3}`).value = reportData.data.salesByToko.reduce((sum: number, item: any) => sum + item.qty, 0);
            sheet3.getCell(`E${totalRow3}`).value = reportData.data.salesByToko.reduce((sum: number, item: any) => sum + item.revenue, 0);
            sheet3.getCell(`E${totalRow3}`).numFmt = '"Rp "#,##0';
            
            ['A', 'B', 'C', 'D', 'E'].forEach(col => {
                const cell = sheet3.getCell(`${col}${totalRow3}`);
                cell.font = { bold: true };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFBFDBFE' } };
                cell.border = {
                    top: { style: 'medium' },
                    left: { style: 'thin' },
                    bottom: { style: 'medium' },
                    right: { style: 'thin' }
                };
            });
            
            // Column widths
            sheet3.getColumn('A').width = 5;
            sheet3.getColumn('B').width = 30;
            sheet3.getColumn('C').width = 12;
            sheet3.getColumn('D').width = 15;
            sheet3.getColumn('E').width = 22;
        }
        
        // ===== SHEET 4: DETAIL TRANSAKSI =====
        if (reportData.data.penjualanList.length > 0) {
            const sheet4 = workbook.addWorksheet('Detail Transaksi', {
                properties: { tabColor: { argb: 'FF3B82F6' } }
            });
            
            // Title
            sheet4.mergeCells('A1:G1');
            const title4 = sheet4.getCell('A1');
            title4.value = 'DETAIL TRANSAKSI PENJUALAN';
            title4.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FF3B82F6' } };
            title4.alignment = { horizontal: 'center', vertical: 'middle' };
            
            // Table Header
            const headers4 = ['Tanggal', 'Kategori', 'Toko', 'Qty', 'Harga Jual', 'Total', 'Kasir'];
            headers4.forEach((header, idx) => {
                const cell = sheet4.getCell(3, idx + 1);
                cell.value = header;
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3B82F6' } };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
            
            // Table Data
            reportData.data.penjualanList.forEach((item: any, idx: number) => {
                const rowNum = 4 + idx;
                sheet4.getCell(`A${rowNum}`).value = new Date(item.tanggal).toLocaleDateString('id-ID');
                sheet4.getCell(`B${rowNum}`).value = item.kategori;
                sheet4.getCell(`C${rowNum}`).value = item.toko;
                sheet4.getCell(`D${rowNum}`).value = item.qty;
                sheet4.getCell(`E${rowNum}`).value = item.hargaJual;
                sheet4.getCell(`E${rowNum}`).numFmt = '"Rp "#,##0';
                sheet4.getCell(`F${rowNum}`).value = item.total;
                sheet4.getCell(`F${rowNum}`).numFmt = '"Rp "#,##0';
                sheet4.getCell(`G${rowNum}`).value = item.kasir;
                
                ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(col => {
                    const cell = sheet4.getCell(`${col}${rowNum}`);
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    if (idx % 2 === 0) {
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf7f9fb' } };
                    }
                });
                
                sheet4.getCell(`D${rowNum}`).alignment = { horizontal: 'center' };
            });
            
            // Total Row
            const totalRow4 = 4 + reportData.data.penjualanList.length;
            sheet4.getCell(`A${totalRow4}`).value = 'TOTAL';
            sheet4.getCell(`B${totalRow4}`).value = '';
            sheet4.getCell(`C${totalRow4}`).value = '';
            sheet4.getCell(`D${totalRow4}`).value = reportData.data.penjualanList.reduce((sum: number, item: any) => sum + item.qty, 0);
            sheet4.getCell(`E${totalRow4}`).value = '';
            sheet4.getCell(`F${totalRow4}`).value = reportData.data.penjualanList.reduce((sum: number, item: any) => sum + item.total, 0);
            sheet4.getCell(`F${totalRow4}`).numFmt = '"Rp "#,##0';
            sheet4.getCell(`G${totalRow4}`).value = '';
            
            ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(col => {
                const cell = sheet4.getCell(`${col}${totalRow4}`);
                cell.font = { bold: true };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFBFDBFE' } };
                cell.border = {
                    top: { style: 'medium' },
                    left: { style: 'thin' },
                    bottom: { style: 'medium' },
                    right: { style: 'thin' }
                };
            });
            
            // Column widths
            sheet4.getColumn('A').width = 15;
            sheet4.getColumn('B').width = 25;
            sheet4.getColumn('C').width = 20;
            sheet4.getColumn('D').width = 10;
            sheet4.getColumn('E').width = 18;
            sheet4.getColumn('F').width = 18;
            sheet4.getColumn('G').width = 20;
        }
        
        // Save Excel
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Laporan-Penjualan-${new Date().getTime()}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error in exportPenjualanExcel:', error);
        throw error;
    }
}

export async function exportDistribusiPDF(reportData: any) {
    try {
        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');

        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(20);
        doc.setTextColor(48, 102, 119);
        doc.text('IMD Clothes', 14, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(95, 107, 111);
        doc.text('CV. Inti Media Digital', 14, 26);
        
        doc.setFontSize(16);
        doc.setTextColor(44, 52, 55);
        doc.text('Laporan Distribusi', 14, 40);
        
        // Info
        const startDate = new Date(reportData.data.periode.start);
        const endDate = new Date(reportData.data.periode.end);
        doc.setFontSize(10);
        doc.setTextColor(95, 107, 111);
        doc.text(`Periode: ${startDate.toLocaleDateString('id-ID')} - ${endDate.toLocaleDateString('id-ID')}`, 14, 47);
        doc.text(`Toko: ${reportData.data.filter.toko}`, 14, 52);
        doc.text(`Status: ${reportData.data.filter.status}`, 14, 57);
        doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`, 14, 62);
        
        let yPos = 70;
        
        // Ringkasan
        doc.setFontSize(12);
        doc.setTextColor(44, 52, 55);
        doc.text('Ringkasan Distribusi', 14, yPos);
        yPos += 8;
        
        const ringkasanData = [
            ['Total Distribusi', `${reportData.data.ringkasan.totalDistribusi} distribusi`],
            ['Total Item Didistribusikan', `${reportData.data.ringkasan.totalItemDistribusi.toLocaleString('id-ID')} pcs`],
            ['Total Nilai Modal', formatRupiah(reportData.data.ringkasan.totalNilaiModal)],
            ['Status Pending', `${reportData.data.ringkasan.statusCount.pending} distribusi`],
            ['Status Dikirim', `${reportData.data.ringkasan.statusCount.dikirim} distribusi`],
            ['Status Diterima', `${reportData.data.ringkasan.statusCount.diterima} distribusi`]
        ];
        
        autoTable(doc, {
            startY: yPos,
            head: [['Metrik', 'Nilai']],
            body: ringkasanData,
            theme: 'grid',
            headStyles: { fillColor: [245, 158, 11], textColor: 255 },
            styles: { fontSize: 9 }
        });
        
        yPos = (doc as any).lastAutoTable.finalY + 10;
        
        // Distribusi Per Toko
        if (reportData.data.distribByToko.length > 0 && yPos < 220) {
            doc.setFontSize(12);
            doc.setTextColor(44, 52, 55);
            doc.text('Distribusi Per Toko', 14, yPos);
            yPos += 8;
            
            const tokoData = reportData.data.distribByToko.map((item: any, i: number) => [
                i + 1,
                item.toko,
                `${item.jumlahDistribusi} kali`,
                `${item.totalItems} pcs`
            ]);
            
            autoTable(doc, {
                startY: yPos,
                head: [['#', 'Toko', 'Jumlah Distribusi', 'Total Item']],
                body: tokoData,
                theme: 'striped',
                headStyles: { fillColor: [245, 158, 11], textColor: 255 },
                styles: { fontSize: 9 }
            });
            
            yPos = (doc as any).lastAutoTable.finalY + 10;
        }
        
        // Detail Distribusi
        if (reportData.data.distribusiList.length > 0) {
            if (yPos > 220) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.setFontSize(12);
            doc.setTextColor(44, 52, 55);
            doc.text('Detail Distribusi', 14, yPos);
            yPos += 8;
            
            const distribData = reportData.data.distribusiList.slice(0, 30).map((item: any) => [
                new Date(item.tanggal).toLocaleDateString('id-ID'),
                item.tokoTujuan,
                item.items.length > 0 ? item.items[0].kategori : '-',
                `${item.items.reduce((sum: number, i: any) => sum + i.jumlah, 0)} pcs`,
                item.status,
                formatRupiah(item.nilaiModal)
            ]);
            
            autoTable(doc, {
                startY: yPos,
                head: [['Tanggal', 'Toko Tujuan', 'Kategori', 'Total Item', 'Status', 'Nilai Modal']],
                body: distribData,
                theme: 'striped',
                headStyles: { fillColor: [245, 158, 11], textColor: 255 },
                styles: { fontSize: 7 },
                columnStyles: {
                    0: { cellWidth: 22 },
                    1: { cellWidth: 30 },
                    2: { cellWidth: 30 },
                    3: { cellWidth: 20 },
                    4: { cellWidth: 22 },
                    5: { cellWidth: 28 }
                }
            });
        }
        
        // Footer
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(
                `Halaman ${i} dari ${pageCount}`,
                doc.internal.pageSize.width / 2,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }
        
        doc.save(`Laporan-Distribusi-${new Date().getTime()}.pdf`);
    } catch (error) {
        console.error('Error in exportDistribusiPDF:', error);
        throw error;
    }
}

export async function exportDistribusiExcel(reportData: any) {
    try {
        const ExcelJS = await import('exceljs');
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'IMD Clothes';
        workbook.created = new Date();
        
        // ===== SHEET 1: RINGKASAN =====
        const sheet1 = workbook.addWorksheet('Ringkasan', {
            properties: { tabColor: { argb: 'FFF59E0B' } }
        });
        
        // Title
        sheet1.mergeCells('A1:B1');
        const titleCell = sheet1.getCell('A1');
        titleCell.value = 'LAPORAN DISTRIBUSI';
        titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFF59E0B' } };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        
        sheet1.mergeCells('A2:B2');
        const subtitleCell = sheet1.getCell('A2');
        subtitleCell.value = 'IMD Clothes - CV. Inti Media Digital';
        subtitleCell.font = { name: 'Calibri', size: 11, color: { argb: 'FF5f6b6f' } };
        subtitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        
        // Info
        sheet1.getCell('A4').value = 'Periode';
        sheet1.getCell('B4').value = `${new Date(reportData.data.periode.start).toLocaleDateString('id-ID')} - ${new Date(reportData.data.periode.end).toLocaleDateString('id-ID')}`;
        sheet1.getCell('A5').value = 'Toko';
        sheet1.getCell('B5').value = reportData.data.filter.toko;
        sheet1.getCell('A6').value = 'Status';
        sheet1.getCell('B6').value = reportData.data.filter.status;
        sheet1.getCell('A7').value = 'Dicetak';
        sheet1.getCell('B7').value = `${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`;
        
        // Ringkasan Section
        sheet1.mergeCells('A9:B9');
        const ringkasanTitle = sheet1.getCell('A9');
        ringkasanTitle.value = 'RINGKASAN DISTRIBUSI';
        ringkasanTitle.font = { name: 'Calibri', size: 12, bold: true };
        ringkasanTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFDE68A' } };
        ringkasanTitle.alignment = { horizontal: 'center', vertical: 'middle' };
        
        // Table Header
        sheet1.getCell('A10').value = 'Metrik';
        sheet1.getCell('B10').value = 'Nilai';
        ['A10', 'B10'].forEach(cell => {
            const c = sheet1.getCell(cell);
            c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF59E0B' } };
            c.alignment = { horizontal: 'center', vertical: 'middle' };
            c.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
        
        // Ringkasan Data
        const ringkasanData = [
            ['Total Distribusi', `${reportData.data.ringkasan.totalDistribusi} distribusi`],
            ['Total Item Didistribusikan', `${reportData.data.ringkasan.totalItemDistribusi.toLocaleString('id-ID')} pcs`],
            ['Total Nilai Modal', reportData.data.ringkasan.totalNilaiModal],
            ['Status Pending', `${reportData.data.ringkasan.statusCount.pending} distribusi`],
            ['Status Dikirim', `${reportData.data.ringkasan.statusCount.dikirim} distribusi`],
            ['Status Diterima', `${reportData.data.ringkasan.statusCount.diterima} distribusi`]
        ];
        
        ringkasanData.forEach((row, idx) => {
            const rowNum = 11 + idx;
            sheet1.getCell(`A${rowNum}`).value = row[0];
            sheet1.getCell(`B${rowNum}`).value = row[1];
            
            if (idx === 2) {
                sheet1.getCell(`B${rowNum}`).numFmt = '"Rp "#,##0';
            }
            
            ['A', 'B'].forEach(col => {
                const cell = sheet1.getCell(`${col}${rowNum}`);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                if (idx % 2 === 0) {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf7f9fb' } };
                }
            });
        });
        
        // Column widths
        sheet1.getColumn('A').width = 35;
        sheet1.getColumn('B').width = 30;
        
        // ===== SHEET 2: DISTRIBUSI PER TOKO =====
        if (reportData.data.distribByToko.length > 0) {
            const sheet2 = workbook.addWorksheet('Per Toko', {
                properties: { tabColor: { argb: 'FFF59E0B' } }
            });
            
            // Title
            sheet2.mergeCells('A1:D1');
            const title2 = sheet2.getCell('A1');
            title2.value = 'DISTRIBUSI PER TOKO';
            title2.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFF59E0B' } };
            title2.alignment = { horizontal: 'center', vertical: 'middle' };
            
            // Table Header
            const headers2 = ['#', 'Toko', 'Jumlah Distribusi', 'Total Item'];
            headers2.forEach((header, idx) => {
                const cell = sheet2.getCell(3, idx + 1);
                cell.value = header;
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF59E0B' } };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
            
            // Table Data
            reportData.data.distribByToko.forEach((item: any, idx: number) => {
                const rowNum = 4 + idx;
                sheet2.getCell(`A${rowNum}`).value = idx + 1;
                sheet2.getCell(`B${rowNum}`).value = item.toko;
                sheet2.getCell(`C${rowNum}`).value = item.jumlahDistribusi;
                sheet2.getCell(`D${rowNum}`).value = item.totalItems;
                
                ['A', 'B', 'C', 'D'].forEach(col => {
                    const cell = sheet2.getCell(`${col}${rowNum}`);
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    if (idx % 2 === 0) {
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf7f9fb' } };
                    }
                });
                
                sheet2.getCell(`A${rowNum}`).alignment = { horizontal: 'center' };
                sheet2.getCell(`C${rowNum}`).alignment = { horizontal: 'center' };
                sheet2.getCell(`D${rowNum}`).alignment = { horizontal: 'center' };
            });
            
            // Total Row
            const totalRow2 = 4 + reportData.data.distribByToko.length;
            sheet2.getCell(`A${totalRow2}`).value = 'TOTAL';
            sheet2.getCell(`B${totalRow2}`).value = '';
            sheet2.getCell(`C${totalRow2}`).value = reportData.data.distribByToko.reduce((sum: number, item: any) => sum + item.jumlahDistribusi, 0);
            sheet2.getCell(`D${totalRow2}`).value = reportData.data.distribByToko.reduce((sum: number, item: any) => sum + item.totalItems, 0);
            
            ['A', 'B', 'C', 'D'].forEach(col => {
                const cell = sheet2.getCell(`${col}${totalRow2}`);
                cell.font = { bold: true };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFDE68A' } };
                cell.border = {
                    top: { style: 'medium' },
                    left: { style: 'thin' },
                    bottom: { style: 'medium' },
                    right: { style: 'thin' }
                };
            });
            
            // Column widths
            sheet2.getColumn('A').width = 5;
            sheet2.getColumn('B').width = 30;
            sheet2.getColumn('C').width = 20;
            sheet2.getColumn('D').width = 15;
        }
        
        // ===== SHEET 3: DISTRIBUSI PER KATEGORI =====
        if (reportData.data.distribByKategori.length > 0) {
            const sheet3 = workbook.addWorksheet('Per Kategori', {
                properties: { tabColor: { argb: 'FFF59E0B' } }
            });
            
            // Title
            sheet3.mergeCells('A1:C1');
            const title3 = sheet3.getCell('A1');
            title3.value = 'DISTRIBUSI PER KATEGORI';
            title3.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFF59E0B' } };
            title3.alignment = { horizontal: 'center', vertical: 'middle' };
            
            // Table Header
            const headers3 = ['#', 'Kategori', 'Total Didistribusikan'];
            headers3.forEach((header, idx) => {
                const cell = sheet3.getCell(3, idx + 1);
                cell.value = header;
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF59E0B' } };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
            
            // Table Data
            reportData.data.distribByKategori.forEach((item: any, idx: number) => {
                const rowNum = 4 + idx;
                sheet3.getCell(`A${rowNum}`).value = idx + 1;
                sheet3.getCell(`B${rowNum}`).value = item.kategori;
                sheet3.getCell(`C${rowNum}`).value = item.jumlah;
                
                ['A', 'B', 'C'].forEach(col => {
                    const cell = sheet3.getCell(`${col}${rowNum}`);
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    if (idx % 2 === 0) {
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf7f9fb' } };
                    }
                });
                
                sheet3.getCell(`A${rowNum}`).alignment = { horizontal: 'center' };
                sheet3.getCell(`C${rowNum}`).alignment = { horizontal: 'center' };
            });
            
            // Total Row
            const totalRow3 = 4 + reportData.data.distribByKategori.length;
            sheet3.getCell(`A${totalRow3}`).value = 'TOTAL';
            sheet3.getCell(`B${totalRow3}`).value = '';
            sheet3.getCell(`C${totalRow3}`).value = reportData.data.distribByKategori.reduce((sum: number, item: any) => sum + item.jumlah, 0);
            
            ['A', 'B', 'C'].forEach(col => {
                const cell = sheet3.getCell(`${col}${totalRow3}`);
                cell.font = { bold: true };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFDE68A' } };
                cell.border = {
                    top: { style: 'medium' },
                    left: { style: 'thin' },
                    bottom: { style: 'medium' },
                    right: { style: 'thin' }
                };
            });
            
            // Column widths
            sheet3.getColumn('A').width = 5;
            sheet3.getColumn('B').width = 35;
            sheet3.getColumn('C').width = 22;
        }
        
        // ===== SHEET 4: DETAIL DISTRIBUSI =====
        if (reportData.data.distribusiList.length > 0) {
            const sheet4 = workbook.addWorksheet('Detail Distribusi', {
                properties: { tabColor: { argb: 'FFF59E0B' } }
            });
            
            // Title
            sheet4.mergeCells('A1:G1');
            const title4 = sheet4.getCell('A1');
            title4.value = 'DETAIL DISTRIBUSI';
            title4.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFF59E0B' } };
            title4.alignment = { horizontal: 'center', vertical: 'middle' };
            
            // Table Header
            const headers4 = ['Tanggal', 'Dari', 'Ke', 'Total Item', 'Nilai Modal', 'Status', 'Keterangan'];
            headers4.forEach((header, idx) => {
                const cell = sheet4.getCell(3, idx + 1);
                cell.value = header;
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF59E0B' } };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
            
            // Table Data
            reportData.data.distribusiList.forEach((item: any, idx: number) => {
                const rowNum = 4 + idx;
                sheet4.getCell(`A${rowNum}`).value = new Date(item.tanggal).toLocaleDateString('id-ID');
                sheet4.getCell(`B${rowNum}`).value = item.tokoAsal;
                sheet4.getCell(`C${rowNum}`).value = item.tokoTujuan;
                sheet4.getCell(`D${rowNum}`).value = item.items.reduce((sum: number, i: any) => sum + i.jumlah, 0);
                sheet4.getCell(`E${rowNum}`).value = item.nilaiModal;
                sheet4.getCell(`E${rowNum}`).numFmt = '"Rp "#,##0';
                sheet4.getCell(`F${rowNum}`).value = item.status;
                sheet4.getCell(`G${rowNum}`).value = item.keterangan || '-';
                
                ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(col => {
                    const cell = sheet4.getCell(`${col}${rowNum}`);
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    if (idx % 2 === 0) {
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf7f9fb' } };
                    }
                });
                
                sheet4.getCell(`D${rowNum}`).alignment = { horizontal: 'center' };
                sheet4.getCell(`F${rowNum}`).alignment = { horizontal: 'center' };
                
                // Color status
                const statusCell = sheet4.getCell(`F${rowNum}`);
                if (item.status === 'PENDING') {
                    statusCell.font = { bold: true, color: { argb: 'FFF59E0B' } };
                } else if (item.status === 'DIKIRIM') {
                    statusCell.font = { bold: true, color: { argb: 'FF3B82F6' } };
                } else if (item.status === 'DITERIMA') {
                    statusCell.font = { bold: true, color: { argb: 'FF10B981' } };
                }
            });
            
            // Total Row
            const totalRow4 = 4 + reportData.data.distribusiList.length;
            sheet4.getCell(`A${totalRow4}`).value = 'TOTAL';
            sheet4.getCell(`B${totalRow4}`).value = '';
            sheet4.getCell(`C${totalRow4}`).value = '';
            sheet4.getCell(`D${totalRow4}`).value = reportData.data.distribusiList.reduce((sum: number, item: any) => {
                return sum + item.items.reduce((s: number, i: any) => s + i.jumlah, 0);
            }, 0);
            sheet4.getCell(`E${totalRow4}`).value = reportData.data.distribusiList.reduce((sum: number, item: any) => sum + item.nilaiModal, 0);
            sheet4.getCell(`E${totalRow4}`).numFmt = '"Rp "#,##0';
            sheet4.getCell(`F${totalRow4}`).value = '';
            sheet4.getCell(`G${totalRow4}`).value = '';
            
            ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(col => {
                const cell = sheet4.getCell(`${col}${totalRow4}`);
                cell.font = { bold: true };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFDE68A' } };
                cell.border = {
                    top: { style: 'medium' },
                    left: { style: 'thin' },
                    bottom: { style: 'medium' },
                    right: { style: 'thin' }
                };
            });
            
            // Column widths
            sheet4.getColumn('A').width = 15;
            sheet4.getColumn('B').width = 20;
            sheet4.getColumn('C').width = 20;
            sheet4.getColumn('D').width = 12;
            sheet4.getColumn('E').width = 20;
            sheet4.getColumn('F').width = 12;
            sheet4.getColumn('G').width = 30;
        }
        
        // Save Excel
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Laporan-Distribusi-${new Date().getTime()}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error in exportDistribusiExcel:', error);
        throw error;
    }
}

export async function exportReturPDF(reportData: any) {
    try {
        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');

        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(20);
        doc.setTextColor(48, 102, 119);
        doc.text('IMD Clothes', 14, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(95, 107, 111);
        doc.text('CV. Inti Media Digital', 14, 26);
        
        doc.setFontSize(16);
        doc.setTextColor(44, 52, 55);
        doc.text('Laporan Retur', 14, 40);
        
        // Info
        const startDate = new Date(reportData.data.periode.start);
        const endDate = new Date(reportData.data.periode.end);
        doc.setFontSize(10);
        doc.setTextColor(95, 107, 111);
        doc.text(`Periode: ${startDate.toLocaleDateString('id-ID')} - ${endDate.toLocaleDateString('id-ID')}`, 14, 47);
        doc.text(`Toko: ${reportData.data.filter.toko}`, 14, 52);
        doc.text(`Status: ${reportData.data.filter.status}`, 14, 57);
        doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`, 14, 62);
        
        let yPos = 70;
        
        // Ringkasan
        doc.setFontSize(12);
        doc.setTextColor(44, 52, 55);
        doc.text('Ringkasan Retur', 14, yPos);
        yPos += 8;
        
        const ringkasanData = [
            ['Total Retur', `${reportData.data.ringkasan.totalRetur} retur`],
            ['Total Qty Diretur', `${reportData.data.ringkasan.totalQtyRetur.toLocaleString('id-ID')} pcs`],
            ['Total Nilai Retur', formatRupiah(reportData.data.ringkasan.totalNilaiRetur)],
            ['Status Pending', `${reportData.data.ringkasan.statusCount.pending} retur`],
            ['Status Disetujui', `${reportData.data.ringkasan.statusCount.disetujui} retur`],
            ['Status Ditolak', `${reportData.data.ringkasan.statusCount.ditolak} retur`]
        ];
        
        autoTable(doc, {
            startY: yPos,
            head: [['Metrik', 'Nilai']],
            body: ringkasanData,
            theme: 'grid',
            headStyles: { fillColor: [220, 38, 38], textColor: 255 },
            styles: { fontSize: 9 }
        });
        
        yPos = (doc as any).lastAutoTable.finalY + 10;
        
        // Retur Per Kategori
        if (reportData.data.returByKategori.length > 0 && yPos < 220) {
            doc.setFontSize(12);
            doc.setTextColor(44, 52, 55);
            doc.text('Retur Per Kategori', 14, yPos);
            yPos += 8;
            
            const kategoriData = reportData.data.returByKategori.map((item: any, i: number) => [
                i + 1,
                item.kategori,
                `${item.jumlahRetur} kali`,
                `${item.totalQty} pcs`
            ]);
            
            autoTable(doc, {
                startY: yPos,
                head: [['#', 'Kategori', 'Jumlah Retur', 'Total Qty']],
                body: kategoriData,
                theme: 'striped',
                headStyles: { fillColor: [220, 38, 38], textColor: 255 },
                styles: { fontSize: 9 }
            });
            
            yPos = (doc as any).lastAutoTable.finalY + 10;
        }
        
        // Detail Retur
        if (reportData.data.returList.length > 0) {
            if (yPos > 220) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.setFontSize(12);
            doc.setTextColor(44, 52, 55);
            doc.text('Detail Retur', 14, yPos);
            yPos += 8;
            
            const returData = reportData.data.returList.slice(0, 30).map((item: any) => [
                new Date(item.tanggal).toLocaleDateString('id-ID'),
                item.kategori,
                item.toko,
                `${item.qty} pcs`,
                item.status,
                formatRupiah(item.nilaiRetur)
            ]);
            
            autoTable(doc, {
                startY: yPos,
                head: [['Tanggal', 'Kategori', 'Toko', 'Qty', 'Status', 'Nilai']],
                body: returData,
                theme: 'striped',
                headStyles: { fillColor: [220, 38, 38], textColor: 255 },
                styles: { fontSize: 7 },
                columnStyles: {
                    0: { cellWidth: 22 },
                    1: { cellWidth: 35 },
                    2: { cellWidth: 30 },
                    3: { cellWidth: 18 },
                    4: { cellWidth: 22 },
                    5: { cellWidth: 25 }
                }
            });
        }
        
        // Footer
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(
                `Halaman ${i} dari ${pageCount}`,
                doc.internal.pageSize.width / 2,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }
        
        doc.save(`Laporan-Retur-${new Date().getTime()}.pdf`);
    } catch (error) {
        console.error('Error in exportReturPDF:', error);
        throw error;
    }
}

export async function exportReturExcel(reportData: any) {
    try {
        const ExcelJS = await import('exceljs');
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'IMD Clothes';
        workbook.created = new Date();
        
        // ===== SHEET 1: RINGKASAN =====
        const sheet1 = workbook.addWorksheet('Ringkasan', {
            properties: { tabColor: { argb: 'FFDC2626' } }
        });
        
        // Title
        sheet1.mergeCells('A1:B1');
        const titleCell = sheet1.getCell('A1');
        titleCell.value = 'LAPORAN RETUR';
        titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFDC2626' } };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        
        sheet1.mergeCells('A2:B2');
        const subtitleCell = sheet1.getCell('A2');
        subtitleCell.value = 'IMD Clothes - CV. Inti Media Digital';
        subtitleCell.font = { name: 'Calibri', size: 11, color: { argb: 'FF5f6b6f' } };
        subtitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        
        // Info
        sheet1.getCell('A4').value = 'Periode';
        sheet1.getCell('B4').value = `${new Date(reportData.data.periode.start).toLocaleDateString('id-ID')} - ${new Date(reportData.data.periode.end).toLocaleDateString('id-ID')}`;
        sheet1.getCell('A5').value = 'Toko';
        sheet1.getCell('B5').value = reportData.data.filter.toko;
        sheet1.getCell('A6').value = 'Status';
        sheet1.getCell('B6').value = reportData.data.filter.status;
        sheet1.getCell('A7').value = 'Dicetak';
        sheet1.getCell('B7').value = `${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`;
        
        // Ringkasan Section
        sheet1.mergeCells('A9:B9');
        const ringkasanTitle = sheet1.getCell('A9');
        ringkasanTitle.value = 'RINGKASAN RETUR';
        ringkasanTitle.font = { name: 'Calibri', size: 12, bold: true };
        ringkasanTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFECACA' } };
        ringkasanTitle.alignment = { horizontal: 'center', vertical: 'middle' };
        
        // Table Header
        sheet1.getCell('A10').value = 'Metrik';
        sheet1.getCell('B10').value = 'Nilai';
        ['A10', 'B10'].forEach(cell => {
            const c = sheet1.getCell(cell);
            c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDC2626' } };
            c.alignment = { horizontal: 'center', vertical: 'middle' };
            c.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
        
        // Ringkasan Data
        const ringkasanData = [
            ['Total Retur', `${reportData.data.ringkasan.totalRetur} retur`],
            ['Total Qty Diretur', `${reportData.data.ringkasan.totalQtyRetur.toLocaleString('id-ID')} pcs`],
            ['Total Nilai Retur', reportData.data.ringkasan.totalNilaiRetur],
            ['Status Pending', `${reportData.data.ringkasan.statusCount.pending} retur`],
            ['Status Disetujui', `${reportData.data.ringkasan.statusCount.disetujui} retur`],
            ['Status Ditolak', `${reportData.data.ringkasan.statusCount.ditolak} retur`]
        ];
        
        ringkasanData.forEach((row, idx) => {
            const rowNum = 11 + idx;
            sheet1.getCell(`A${rowNum}`).value = row[0];
            sheet1.getCell(`B${rowNum}`).value = row[1];
            
            if (idx === 2) {
                sheet1.getCell(`B${rowNum}`).numFmt = '"Rp "#,##0';
            }
            
            ['A', 'B'].forEach(col => {
                const cell = sheet1.getCell(`${col}${rowNum}`);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                if (idx % 2 === 0) {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf7f9fb' } };
                }
            });
        });
        
        // Column widths
        sheet1.getColumn('A').width = 35;
        sheet1.getColumn('B').width = 30;
        
        // ===== SHEET 2: RETUR PER KATEGORI =====
        if (reportData.data.returByKategori.length > 0) {
            const sheet2 = workbook.addWorksheet('Per Kategori', {
                properties: { tabColor: { argb: 'FFDC2626' } }
            });
            
            // Title
            sheet2.mergeCells('A1:D1');
            const title2 = sheet2.getCell('A1');
            title2.value = 'RETUR PER KATEGORI';
            title2.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFDC2626' } };
            title2.alignment = { horizontal: 'center', vertical: 'middle' };
            
            // Table Header
            const headers2 = ['#', 'Kategori', 'Jumlah Retur', 'Total Qty'];
            headers2.forEach((header, idx) => {
                const cell = sheet2.getCell(3, idx + 1);
                cell.value = header;
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDC2626' } };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
            
            // Table Data
            reportData.data.returByKategori.forEach((item: any, idx: number) => {
                const rowNum = 4 + idx;
                sheet2.getCell(`A${rowNum}`).value = idx + 1;
                sheet2.getCell(`B${rowNum}`).value = item.kategori;
                sheet2.getCell(`C${rowNum}`).value = item.jumlahRetur;
                sheet2.getCell(`D${rowNum}`).value = item.totalQty;
                
                ['A', 'B', 'C', 'D'].forEach(col => {
                    const cell = sheet2.getCell(`${col}${rowNum}`);
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    if (idx % 2 === 0) {
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFfef2f2' } };
                    }
                });
                
                sheet2.getCell(`A${rowNum}`).alignment = { horizontal: 'center' };
                sheet2.getCell(`C${rowNum}`).alignment = { horizontal: 'center' };
                sheet2.getCell(`D${rowNum}`).alignment = { horizontal: 'center' };
            });
            
            // Total Row
            const totalRow2 = 4 + reportData.data.returByKategori.length;
            sheet2.getCell(`A${totalRow2}`).value = 'TOTAL';
            sheet2.getCell(`B${totalRow2}`).value = '';
            sheet2.getCell(`C${totalRow2}`).value = reportData.data.returByKategori.reduce((sum: number, item: any) => sum + item.jumlahRetur, 0);
            sheet2.getCell(`D${totalRow2}`).value = reportData.data.returByKategori.reduce((sum: number, item: any) => sum + item.totalQty, 0);
            
            ['A', 'B', 'C', 'D'].forEach(col => {
                const cell = sheet2.getCell(`${col}${totalRow2}`);
                cell.font = { bold: true };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFECACA' } };
                cell.border = {
                    top: { style: 'medium' },
                    left: { style: 'thin' },
                    bottom: { style: 'medium' },
                    right: { style: 'thin' }
                };
            });
            
            // Column widths
            sheet2.getColumn('A').width = 5;
            sheet2.getColumn('B').width = 35;
            sheet2.getColumn('C').width = 18;
            sheet2.getColumn('D').width = 15;
        }
        
        // ===== SHEET 3: RETUR PER TOKO =====
        if (reportData.data.returByToko.length > 0) {
            const sheet3 = workbook.addWorksheet('Per Toko', {
                properties: { tabColor: { argb: 'FFDC2626' } }
            });
            
            // Title
            sheet3.mergeCells('A1:D1');
            const title3 = sheet3.getCell('A1');
            title3.value = 'RETUR PER TOKO';
            title3.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFDC2626' } };
            title3.alignment = { horizontal: 'center', vertical: 'middle' };
            
            // Table Header
            const headers3 = ['#', 'Toko', 'Jumlah Retur', 'Total Qty'];
            headers3.forEach((header, idx) => {
                const cell = sheet3.getCell(3, idx + 1);
                cell.value = header;
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDC2626' } };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
            
            // Table Data
            reportData.data.returByToko.forEach((item: any, idx: number) => {
                const rowNum = 4 + idx;
                sheet3.getCell(`A${rowNum}`).value = idx + 1;
                sheet3.getCell(`B${rowNum}`).value = item.toko;
                sheet3.getCell(`C${rowNum}`).value = item.jumlahRetur;
                sheet3.getCell(`D${rowNum}`).value = item.totalQty;
                
                ['A', 'B', 'C', 'D'].forEach(col => {
                    const cell = sheet3.getCell(`${col}${rowNum}`);
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    if (idx % 2 === 0) {
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFfef2f2' } };
                    }
                });
                
                sheet3.getCell(`A${rowNum}`).alignment = { horizontal: 'center' };
                sheet3.getCell(`C${rowNum}`).alignment = { horizontal: 'center' };
                sheet3.getCell(`D${rowNum}`).alignment = { horizontal: 'center' };
            });
            
            // Total Row
            const totalRow3 = 4 + reportData.data.returByToko.length;
            sheet3.getCell(`A${totalRow3}`).value = 'TOTAL';
            sheet3.getCell(`B${totalRow3}`).value = '';
            sheet3.getCell(`C${totalRow3}`).value = reportData.data.returByToko.reduce((sum: number, item: any) => sum + item.jumlahRetur, 0);
            sheet3.getCell(`D${totalRow3}`).value = reportData.data.returByToko.reduce((sum: number, item: any) => sum + item.totalQty, 0);
            
            ['A', 'B', 'C', 'D'].forEach(col => {
                const cell = sheet3.getCell(`${col}${totalRow3}`);
                cell.font = { bold: true };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFECACA' } };
                cell.border = {
                    top: { style: 'medium' },
                    left: { style: 'thin' },
                    bottom: { style: 'medium' },
                    right: { style: 'thin' }
                };
            });
            
            // Column widths
            sheet3.getColumn('A').width = 5;
            sheet3.getColumn('B').width = 30;
            sheet3.getColumn('C').width = 18;
            sheet3.getColumn('D').width = 15;
        }
        
        // ===== SHEET 4: DETAIL RETUR =====
        if (reportData.data.returList.length > 0) {
            const sheet4 = workbook.addWorksheet('Detail Retur', {
                properties: { tabColor: { argb: 'FFDC2626' } }
            });
            
            // Title
            sheet4.mergeCells('A1:H1');
            const title4 = sheet4.getCell('A1');
            title4.value = 'DETAIL RETUR';
            title4.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFDC2626' } };
            title4.alignment = { horizontal: 'center', vertical: 'middle' };
            
            // Table Header
            const headers4 = ['Tanggal', 'Kategori', 'Toko', 'Qty', 'Nilai Retur', 'Status', 'Keterangan', 'Dibuat Oleh'];
            headers4.forEach((header, idx) => {
                const cell = sheet4.getCell(3, idx + 1);
                cell.value = header;
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDC2626' } };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
            
            // Table Data
            reportData.data.returList.forEach((item: any, idx: number) => {
                const rowNum = 4 + idx;
                sheet4.getCell(`A${rowNum}`).value = new Date(item.tanggal).toLocaleDateString('id-ID');
                sheet4.getCell(`B${rowNum}`).value = item.kategori;
                sheet4.getCell(`C${rowNum}`).value = item.toko;
                sheet4.getCell(`D${rowNum}`).value = item.qty;
                sheet4.getCell(`E${rowNum}`).value = item.nilaiRetur;
                sheet4.getCell(`E${rowNum}`).numFmt = '"Rp "#,##0';
                sheet4.getCell(`F${rowNum}`).value = item.status;
                sheet4.getCell(`G${rowNum}`).value = item.keterangan || '-';
                sheet4.getCell(`H${rowNum}`).value = item.createdBy;
                
                ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach(col => {
                    const cell = sheet4.getCell(`${col}${rowNum}`);
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    if (idx % 2 === 0) {
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFfef2f2' } };
                    }
                });
                
                sheet4.getCell(`D${rowNum}`).alignment = { horizontal: 'center' };
                sheet4.getCell(`F${rowNum}`).alignment = { horizontal: 'center' };
                
                // Color status
                const statusCell = sheet4.getCell(`F${rowNum}`);
                if (item.status === 'PENDING') {
                    statusCell.font = { bold: true, color: { argb: 'FFF59E0B' } };
                } else if (item.status === 'DISETUJUI') {
                    statusCell.font = { bold: true, color: { argb: 'FF10B981' } };
                } else if (item.status === 'DITOLAK') {
                    statusCell.font = { bold: true, color: { argb: 'FFDC2626' } };
                }
            });
            
            // Total Row
            const totalRow4 = 4 + reportData.data.returList.length;
            sheet4.getCell(`A${totalRow4}`).value = 'TOTAL';
            sheet4.getCell(`B${totalRow4}`).value = '';
            sheet4.getCell(`C${totalRow4}`).value = '';
            sheet4.getCell(`D${totalRow4}`).value = reportData.data.returList.reduce((sum: number, item: any) => sum + item.qty, 0);
            sheet4.getCell(`E${totalRow4}`).value = reportData.data.returList.reduce((sum: number, item: any) => sum + item.nilaiRetur, 0);
            sheet4.getCell(`E${totalRow4}`).numFmt = '"Rp "#,##0';
            sheet4.getCell(`F${totalRow4}`).value = '';
            sheet4.getCell(`G${totalRow4}`).value = '';
            sheet4.getCell(`H${totalRow4}`).value = '';
            
            ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach(col => {
                const cell = sheet4.getCell(`${col}${totalRow4}`);
                cell.font = { bold: true };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFECACA' } };
                cell.border = {
                    top: { style: 'medium' },
                    left: { style: 'thin' },
                    bottom: { style: 'medium' },
                    right: { style: 'thin' }
                };
            });
            
            // Column widths
            sheet4.getColumn('A').width = 15;
            sheet4.getColumn('B').width = 25;
            sheet4.getColumn('C').width = 20;
            sheet4.getColumn('D').width = 10;
            sheet4.getColumn('E').width = 18;
            sheet4.getColumn('F').width = 12;
            sheet4.getColumn('G').width = 30;
            sheet4.getColumn('H').width = 20;
        }
        
        // Save Excel
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Laporan-Retur-${new Date().getTime()}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error in exportReturExcel:', error);
        throw error;
    }
}
