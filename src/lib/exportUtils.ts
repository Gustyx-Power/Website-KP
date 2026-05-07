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

export async function exportStokTokoPDF(reportData: any) {
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
        doc.text('Laporan Stok Per Toko', 14, 40);
        
        // Info
        doc.setFontSize(10);
        doc.setTextColor(95, 107, 111);
        doc.text(`Filter: ${reportData.data.filter.toko}`, 14, 47);
        doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`, 14, 52);
        
        let yPos = 60;
        
        // Ringkasan
        doc.setFontSize(12);
        doc.setTextColor(44, 52, 55);
        doc.text('Ringkasan Stok', 14, yPos);
        yPos += 8;
        
        const ringkasanData = [
            ['Total Toko', `${reportData.data.ringkasan.totalToko} toko`],
            ['Total Kategori', `${reportData.data.ringkasan.totalKategori} kategori`],
            ['Total Unit Stok', `${reportData.data.ringkasan.totalUnit.toLocaleString('id-ID')} unit`],
            ['Total Nilai Modal', formatRupiah(reportData.data.ringkasan.totalNilaiModal)],
            ['Stok Menipis (< 15 unit)', `${reportData.data.ringkasan.jumlahStokMenipis} item`]
        ];
        
        autoTable(doc, {
            startY: yPos,
            head: [['Metrik', 'Nilai']],
            body: ringkasanData,
            theme: 'grid',
            headStyles: { fillColor: [147, 51, 234], textColor: 255 },
            styles: { fontSize: 9 }
        });
        
        yPos = (doc as any).lastAutoTable.finalY + 10;
        
        // Ringkasan Per Toko
        if (reportData.data.stokByToko.length > 0 && yPos < 220) {
            doc.setFontSize(12);
            doc.setTextColor(44, 52, 55);
            doc.text('Ringkasan Per Toko', 14, yPos);
            yPos += 8;
            
            const tokoData = reportData.data.stokByToko.map((item: any) => [
                item.toko,
                `${item.jumlahKategori} kategori`,
                `${item.totalUnit} unit`,
                formatRupiah(item.totalNilaiModal)
            ]);
            
            autoTable(doc, {
                startY: yPos,
                head: [['Toko', 'Jumlah Kategori', 'Total Unit', 'Nilai Modal']],
                body: tokoData,
                theme: 'striped',
                headStyles: { fillColor: [147, 51, 234], textColor: 255 },
                styles: { fontSize: 8 },
                columnStyles: {
                    0: { cellWidth: 45 },
                    1: { cellWidth: 35 },
                    2: { cellWidth: 30 },
                    3: { cellWidth: 40 }
                }
            });
            
            yPos = (doc as any).lastAutoTable.finalY + 10;
        }
        
        // Detail per toko (halaman terpisah untuk setiap toko)
        reportData.data.stokByToko.forEach((toko: any, tokoIdx: number) => {
            if (tokoIdx > 0 || yPos > 220) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.setFontSize(12);
            doc.setTextColor(147, 51, 234);
            doc.text(`Detail Stok - ${toko.toko}`, 14, yPos);
            yPos += 5;
            
            doc.setFontSize(9);
            doc.setTextColor(95, 107, 111);
            doc.text(`Total: ${toko.totalUnit} unit | Nilai: ${formatRupiah(toko.totalNilaiModal)}`, 14, yPos);
            yPos += 8;
            
            const itemData = toko.items.slice(0, 30).map((item: any) => [
                item.kategori,
                `${item.jumlah} unit`,
                formatRupiah(item.hargaModal),
                formatRupiah(item.nilaiTotal),
                item.status
            ]);
            
            autoTable(doc, {
                startY: yPos,
                head: [['Kategori', 'Stok', 'Harga Modal', 'Nilai Total', 'Status']],
                body: itemData,
                theme: 'striped',
                headStyles: { fillColor: [147, 51, 234], textColor: 255 },
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
            
            yPos = (doc as any).lastAutoTable.finalY + 15;
        });
        
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
        
        doc.save(`Laporan-Stok-Per-Toko-${new Date().getTime()}.pdf`);
    } catch (error) {
        console.error('Error in exportStokTokoPDF:', error);
        throw error;
    }
}

export async function exportStokTokoExcel(reportData: any) {
    try {
        const ExcelJS = await import('exceljs');
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'IMD Clothes';
        workbook.created = new Date();
        
        // ===== SHEET 1: RINGKASAN =====
        const sheet1 = workbook.addWorksheet('Ringkasan', {
            properties: { tabColor: { argb: 'FF9333EA' } }
        });
        
        // Title
        sheet1.mergeCells('A1:B1');
        const titleCell = sheet1.getCell('A1');
        titleCell.value = 'LAPORAN STOK PER TOKO';
        titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FF9333EA' } };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        
        sheet1.mergeCells('A2:B2');
        const subtitleCell = sheet1.getCell('A2');
        subtitleCell.value = 'IMD Clothes - CV. Inti Media Digital';
        subtitleCell.font = { name: 'Calibri', size: 11, color: { argb: 'FF5f6b6f' } };
        subtitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        
        // Info
        sheet1.getCell('A4').value = 'Filter';
        sheet1.getCell('B4').value = reportData.data.filter.toko;
        sheet1.getCell('A5').value = 'Dicetak';
        sheet1.getCell('B5').value = `${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`;
        
        // Ringkasan Section
        sheet1.mergeCells('A7:B7');
        const ringkasanTitle = sheet1.getCell('A7');
        ringkasanTitle.value = 'RINGKASAN STOK';
        ringkasanTitle.font = { name: 'Calibri', size: 12, bold: true };
        ringkasanTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE9D5FF' } };
        ringkasanTitle.alignment = { horizontal: 'center', vertical: 'middle' };
        
        // Table Header
        sheet1.getCell('A8').value = 'Metrik';
        sheet1.getCell('B8').value = 'Nilai';
        ['A8', 'B8'].forEach(cell => {
            const c = sheet1.getCell(cell);
            c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF9333EA' } };
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
            ['Total Toko', `${reportData.data.ringkasan.totalToko} toko`],
            ['Total Kategori', `${reportData.data.ringkasan.totalKategori} kategori`],
            ['Total Unit Stok', `${reportData.data.ringkasan.totalUnit.toLocaleString('id-ID')} unit`],
            ['Total Nilai Modal', reportData.data.ringkasan.totalNilaiModal],
            ['Stok Menipis (< 15 unit)', `${reportData.data.ringkasan.jumlahStokMenipis} item`]
        ];
        
        ringkasanData.forEach((row, idx) => {
            const rowNum = 9 + idx;
            sheet1.getCell(`A${rowNum}`).value = row[0];
            sheet1.getCell(`B${rowNum}`).value = row[1];
            
            if (idx === 3) {
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
        
        // ===== SHEET 2: RINGKASAN PER TOKO =====
        if (reportData.data.stokByToko.length > 0) {
            const sheet2 = workbook.addWorksheet('Ringkasan Per Toko', {
                properties: { tabColor: { argb: 'FF9333EA' } }
            });
            
            // Title
            sheet2.mergeCells('A1:E1');
            const title2 = sheet2.getCell('A1');
            title2.value = 'RINGKASAN STOK PER TOKO';
            title2.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FF9333EA' } };
            title2.alignment = { horizontal: 'center', vertical: 'middle' };
            
            // Table Header
            const headers2 = ['Toko', 'Jumlah Kategori', 'Total Unit', 'Nilai Modal', 'Stok Menipis'];
            headers2.forEach((header, idx) => {
                const cell = sheet2.getCell(3, idx + 1);
                cell.value = header;
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF9333EA' } };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
            
            // Table Data
            reportData.data.stokByToko.forEach((item: any, idx: number) => {
                const rowNum = 4 + idx;
                sheet2.getCell(`A${rowNum}`).value = item.toko;
                sheet2.getCell(`B${rowNum}`).value = item.jumlahKategori;
                sheet2.getCell(`C${rowNum}`).value = item.totalUnit;
                sheet2.getCell(`D${rowNum}`).value = item.totalNilaiModal;
                sheet2.getCell(`D${rowNum}`).numFmt = '"Rp "#,##0';
                sheet2.getCell(`E${rowNum}`).value = item.stokMenipis;
                
                ['A', 'B', 'C', 'D', 'E'].forEach(col => {
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
                
                sheet2.getCell(`B${rowNum}`).alignment = { horizontal: 'center' };
                sheet2.getCell(`C${rowNum}`).alignment = { horizontal: 'center' };
                sheet2.getCell(`E${rowNum}`).alignment = { horizontal: 'center' };
            });
            
            // Total Row
            const totalRow2 = 4 + reportData.data.stokByToko.length;
            sheet2.getCell(`A${totalRow2}`).value = 'TOTAL';
            sheet2.getCell(`B${totalRow2}`).value = reportData.data.stokByToko.reduce((sum: number, item: any) => sum + item.jumlahKategori, 0);
            sheet2.getCell(`C${totalRow2}`).value = reportData.data.stokByToko.reduce((sum: number, item: any) => sum + item.totalUnit, 0);
            sheet2.getCell(`D${totalRow2}`).value = reportData.data.stokByToko.reduce((sum: number, item: any) => sum + item.totalNilaiModal, 0);
            sheet2.getCell(`D${totalRow2}`).numFmt = '"Rp "#,##0';
            sheet2.getCell(`E${totalRow2}`).value = reportData.data.stokByToko.reduce((sum: number, item: any) => sum + item.stokMenipis, 0);
            
            ['A', 'B', 'C', 'D', 'E'].forEach(col => {
                const cell = sheet2.getCell(`${col}${totalRow2}`);
                cell.font = { bold: true };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE9D5FF' } };
                cell.border = {
                    top: { style: 'medium' },
                    left: { style: 'thin' },
                    bottom: { style: 'medium' },
                    right: { style: 'thin' }
                };
            });
            
            // Column widths
            sheet2.getColumn('A').width = 30;
            sheet2.getColumn('B').width = 18;
            sheet2.getColumn('C').width = 15;
            sheet2.getColumn('D').width = 22; // Diperlebar untuk currency format
            sheet2.getColumn('E').width = 15;
        }
        
        // ===== SHEET 3+: DETAIL PER TOKO =====
        reportData.data.stokByToko.forEach((toko: any) => {
            const sheetName = toko.toko.substring(0, 30); // Excel sheet name max 31 chars
            const sheet = workbook.addWorksheet(sheetName, {
                properties: { tabColor: { argb: 'FF9333EA' } }
            });
            
            // Title
            sheet.mergeCells('A1:E1');
            const title = sheet.getCell('A1');
            title.value = `DETAIL STOK - ${toko.toko}`;
            title.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FF9333EA' } };
            title.alignment = { horizontal: 'center', vertical: 'middle' };
            
            // Info
            sheet.getCell('A3').value = 'Total Unit';
            sheet.getCell('B3').value = `${toko.totalUnit} unit`;
            sheet.getCell('A4').value = 'Nilai Modal';
            sheet.getCell('B4').value = toko.totalNilaiModal;
            sheet.getCell('B4').numFmt = '"Rp "#,##0';
            
            // Merge cells untuk info agar lebih lebar
            sheet.mergeCells('B3:D3');
            sheet.mergeCells('B4:D4');
            
            // Table Header
            const headers = ['Kategori', 'Stok', 'Harga Modal', 'Nilai Total', 'Status'];
            headers.forEach((header, idx) => {
                const cell = sheet.getCell(6, idx + 1);
                cell.value = header;
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF9333EA' } };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
            
            // Table Data
            toko.items.forEach((item: any, idx: number) => {
                const rowNum = 7 + idx;
                sheet.getCell(`A${rowNum}`).value = item.kategori;
                sheet.getCell(`B${rowNum}`).value = item.jumlah;
                sheet.getCell(`C${rowNum}`).value = item.hargaModal;
                sheet.getCell(`C${rowNum}`).numFmt = '"Rp "#,##0';
                sheet.getCell(`D${rowNum}`).value = item.nilaiTotal;
                sheet.getCell(`D${rowNum}`).numFmt = '"Rp "#,##0';
                sheet.getCell(`E${rowNum}`).value = item.status;
                
                ['A', 'B', 'C', 'D', 'E'].forEach(col => {
                    const cell = sheet.getCell(`${col}${rowNum}`);
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
                
                sheet.getCell(`B${rowNum}`).alignment = { horizontal: 'center' };
                sheet.getCell(`E${rowNum}`).alignment = { horizontal: 'center' };
                
                // Color status
                const statusCell = sheet.getCell(`E${rowNum}`);
                if (item.status === 'Kritis') {
                    statusCell.font = { bold: true, color: { argb: 'FFDC2626' } };
                } else if (item.status === 'Menipis') {
                    statusCell.font = { bold: true, color: { argb: 'FFF59E0B' } };
                } else {
                    statusCell.font = { bold: true, color: { argb: 'FF10B981' } };
                }
            });
            
            // Total Row
            const totalRow = 7 + toko.items.length;
            sheet.getCell(`A${totalRow}`).value = 'TOTAL';
            sheet.getCell(`B${totalRow}`).value = toko.totalUnit;
            sheet.getCell(`C${totalRow}`).value = '';
            sheet.getCell(`D${totalRow}`).value = toko.totalNilaiModal;
            sheet.getCell(`D${totalRow}`).numFmt = '"Rp "#,##0';
            sheet.getCell(`E${totalRow}`).value = '';
            
            ['A', 'B', 'C', 'D', 'E'].forEach(col => {
                const cell = sheet.getCell(`${col}${totalRow}`);
                cell.font = { bold: true };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE9D5FF' } };
                cell.border = {
                    top: { style: 'medium' },
                    left: { style: 'thin' },
                    bottom: { style: 'medium' },
                    right: { style: 'thin' }
                };
            });
            
            // Column widths
            sheet.getColumn('A').width = 30; // Untuk nama kategori
            sheet.getColumn('B').width = 15; // Untuk stok
            sheet.getColumn('C').width = 22; // Diperlebar untuk currency format
            sheet.getColumn('D').width = 22; // Diperlebar untuk currency format
            sheet.getColumn('E').width = 12; // Untuk status
        });
        
        // ===== SHEET LAST: STOK MENIPIS =====
        if (reportData.data.stokMenipis.length > 0) {
            const sheetLast = workbook.addWorksheet('Stok Menipis', {
                properties: { tabColor: { argb: 'FFDC2626' } }
            });
            
            // Title
            sheetLast.mergeCells('A1:E1');
            const titleLast = sheetLast.getCell('A1');
            titleLast.value = 'STOK MENIPIS (< 15 UNIT)';
            titleLast.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFDC2626' } };
            titleLast.alignment = { horizontal: 'center', vertical: 'middle' };
            
            // Table Header
            const headersLast = ['Toko', 'Kategori', 'Stok Tersisa', 'Harga Modal', 'Status'];
            headersLast.forEach((header, idx) => {
                const cell = sheetLast.getCell(3, idx + 1);
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
                sheetLast.getCell(`A${rowNum}`).value = item.toko;
                sheetLast.getCell(`B${rowNum}`).value = item.kategori;
                sheetLast.getCell(`C${rowNum}`).value = item.jumlah;
                sheetLast.getCell(`D${rowNum}`).value = item.hargaModal;
                sheetLast.getCell(`D${rowNum}`).numFmt = '"Rp "#,##0';
                sheetLast.getCell(`E${rowNum}`).value = item.status;
                
                ['A', 'B', 'C', 'D', 'E'].forEach(col => {
                    const cell = sheetLast.getCell(`${col}${rowNum}`);
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
                
                const stokCell = sheetLast.getCell(`C${rowNum}`);
                stokCell.alignment = { horizontal: 'center' };
                if (item.status === 'Kritis') {
                    stokCell.font = { bold: true, color: { argb: 'FFDC2626' } };
                    stokCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFECACA' } };
                }
                
                const statusCell = sheetLast.getCell(`E${rowNum}`);
                statusCell.alignment = { horizontal: 'center' };
                if (item.status === 'Kritis') {
                    statusCell.font = { bold: true, color: { argb: 'FFDC2626' } };
                } else {
                    statusCell.font = { bold: true, color: { argb: 'FFF59E0B' } };
                }
            });
            
            // Column widths
            sheetLast.getColumn('A').width = 25;
            sheetLast.getColumn('B').width = 30;
            sheetLast.getColumn('C').width = 15;
            sheetLast.getColumn('D').width = 22; // Diperlebar untuk currency format
            sheetLast.getColumn('E').width = 12;
        }
        
        // Save Excel
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Laporan-Stok-Per-Toko-${new Date().getTime()}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error in exportStokTokoExcel:', error);
        throw error;
    }
}

export async function exportPegawaiPDF(reportData: any) {
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
        doc.text('Laporan Pegawai', 14, 40);
        
        // Info
        doc.setFontSize(10);
        doc.setTextColor(95, 107, 111);
        doc.text(`Role: ${reportData.data.filter.role}`, 14, 47);
        doc.text(`Status: ${reportData.data.filter.status}`, 14, 52);
        doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`, 14, 57);
        
        let yPos = 65;
        
        // Ringkasan
        doc.setFontSize(12);
        doc.setTextColor(44, 52, 55);
        doc.text('Ringkasan Pegawai', 14, yPos);
        yPos += 8;
        
        const ringkasanData = [
            ['Total Pegawai', `${reportData.data.ringkasan.totalPegawai} orang`],
            ['Pegawai Aktif', `${reportData.data.ringkasan.pegawaiAktif} orang`],
            ['Pegawai Non-Aktif', `${reportData.data.ringkasan.pegawaiNonAktif} orang`],
            ['Owner', `${reportData.data.ringkasan.roleCount.owner} orang`],
            ['Admin', `${reportData.data.ringkasan.roleCount.admin} orang`],
            ['Kasir', `${reportData.data.ringkasan.roleCount.kasir} orang`]
        ];
        
        autoTable(doc, {
            startY: yPos,
            head: [['Metrik', 'Nilai']],
            body: ringkasanData,
            theme: 'grid',
            headStyles: { fillColor: [99, 102, 241], textColor: 255 },
            styles: { fontSize: 9 }
        });
        
        yPos = (doc as any).lastAutoTable.finalY + 10;
        
        // Pegawai Per Role
        if (reportData.data.pegawaiByRole.length > 0 && yPos < 220) {
            doc.setFontSize(12);
            doc.setTextColor(44, 52, 55);
            doc.text('Pegawai Per Role', 14, yPos);
            yPos += 8;
            
            const roleData = reportData.data.pegawaiByRole.map((item: any) => [
                item.role,
                `${item.jumlah} orang`,
                `${item.aktif} aktif`,
                `${item.nonAktif} non-aktif`
            ]);
            
            autoTable(doc, {
                startY: yPos,
                head: [['Role', 'Total', 'Aktif', 'Non-Aktif']],
                body: roleData,
                theme: 'striped',
                headStyles: { fillColor: [99, 102, 241], textColor: 255 },
                styles: { fontSize: 9 }
            });
            
            yPos = (doc as any).lastAutoTable.finalY + 10;
        }
        
        // Detail Pegawai
        if (reportData.data.pegawaiList.length > 0) {
            if (yPos > 220) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.setFontSize(12);
            doc.setTextColor(44, 52, 55);
            doc.text('Detail Pegawai', 14, yPos);
            yPos += 8;
            
            const pegawaiData = reportData.data.pegawaiList.map((item: any) => [
                item.name,
                item.email,
                item.role,
                item.toko,
                item.isActive ? 'Aktif' : 'Non-Aktif'
            ]);
            
            autoTable(doc, {
                startY: yPos,
                head: [['Nama', 'Email', 'Role', 'Toko', 'Status']],
                body: pegawaiData,
                theme: 'striped',
                headStyles: { fillColor: [99, 102, 241], textColor: 255 },
                styles: { fontSize: 8 },
                columnStyles: {
                    0: { cellWidth: 35 },
                    1: { cellWidth: 45 },
                    2: { cellWidth: 25 },
                    3: { cellWidth: 35 },
                    4: { cellWidth: 25 }
                },
                didParseCell: function(data: any) {
                    if (data.section === 'body' && data.column.index === 4) {
                        const status = data.cell.raw;
                        if (status === 'Aktif') {
                            data.cell.styles.textColor = [16, 185, 129];
                            data.cell.styles.fontStyle = 'bold';
                        } else {
                            data.cell.styles.textColor = [156, 163, 175];
                        }
                    }
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
        
        doc.save(`Laporan-Pegawai-${new Date().getTime()}.pdf`);
    } catch (error) {
        console.error('Error in exportPegawaiPDF:', error);
        throw error;
    }
}

export async function exportPegawaiExcel(reportData: any) {
    try {
        const ExcelJS = await import('exceljs');
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'IMD Clothes';
        workbook.created = new Date();
        
        // ===== SHEET 1: RINGKASAN =====
        const sheet1 = workbook.addWorksheet('Ringkasan', {
            properties: { tabColor: { argb: 'FF6366F1' } }
        });
        
        // Title
        sheet1.mergeCells('A1:B1');
        const titleCell = sheet1.getCell('A1');
        titleCell.value = 'LAPORAN PEGAWAI';
        titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FF6366F1' } };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        
        sheet1.mergeCells('A2:B2');
        const subtitleCell = sheet1.getCell('A2');
        subtitleCell.value = 'IMD Clothes - CV. Inti Media Digital';
        subtitleCell.font = { name: 'Calibri', size: 11, color: { argb: 'FF5f6b6f' } };
        subtitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        
        // Info
        sheet1.getCell('A4').value = 'Role';
        sheet1.getCell('B4').value = reportData.data.filter.role;
        sheet1.getCell('A5').value = 'Status';
        sheet1.getCell('B5').value = reportData.data.filter.status;
        sheet1.getCell('A6').value = 'Dicetak';
        sheet1.getCell('B6').value = `${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`;
        
        // Ringkasan Section
        sheet1.mergeCells('A8:B8');
        const ringkasanTitle = sheet1.getCell('A8');
        ringkasanTitle.value = 'RINGKASAN PEGAWAI';
        ringkasanTitle.font = { name: 'Calibri', size: 12, bold: true };
        ringkasanTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC7D2FE' } };
        ringkasanTitle.alignment = { horizontal: 'center', vertical: 'middle' };
        
        // Table Header
        sheet1.getCell('A9').value = 'Metrik';
        sheet1.getCell('B9').value = 'Nilai';
        ['A9', 'B9'].forEach(cell => {
            const c = sheet1.getCell(cell);
            c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6366F1' } };
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
            ['Total Pegawai', `${reportData.data.ringkasan.totalPegawai} orang`],
            ['Pegawai Aktif', `${reportData.data.ringkasan.pegawaiAktif} orang`],
            ['Pegawai Non-Aktif', `${reportData.data.ringkasan.pegawaiNonAktif} orang`],
            ['Owner', `${reportData.data.ringkasan.roleCount.owner} orang`],
            ['Admin', `${reportData.data.ringkasan.roleCount.admin} orang`],
            ['Kasir', `${reportData.data.ringkasan.roleCount.kasir} orang`]
        ];
        
        ringkasanData.forEach((row, idx) => {
            const rowNum = 10 + idx;
            sheet1.getCell(`A${rowNum}`).value = row[0];
            sheet1.getCell(`B${rowNum}`).value = row[1];
            
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
        
        // ===== SHEET 2: PEGAWAI PER ROLE =====
        if (reportData.data.pegawaiByRole.length > 0) {
            const sheet2 = workbook.addWorksheet('Per Role', {
                properties: { tabColor: { argb: 'FF6366F1' } }
            });
            
            // Title
            sheet2.mergeCells('A1:D1');
            const title2 = sheet2.getCell('A1');
            title2.value = 'PEGAWAI PER ROLE';
            title2.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FF6366F1' } };
            title2.alignment = { horizontal: 'center', vertical: 'middle' };
            
            // Table Header
            const headers2 = ['Role', 'Total', 'Aktif', 'Non-Aktif'];
            headers2.forEach((header, idx) => {
                const cell = sheet2.getCell(3, idx + 1);
                cell.value = header;
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6366F1' } };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
            
            // Table Data
            reportData.data.pegawaiByRole.forEach((item: any, idx: number) => {
                const rowNum = 4 + idx;
                sheet2.getCell(`A${rowNum}`).value = item.role;
                sheet2.getCell(`B${rowNum}`).value = item.jumlah;
                sheet2.getCell(`C${rowNum}`).value = item.aktif;
                sheet2.getCell(`D${rowNum}`).value = item.nonAktif;
                
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
                
                sheet2.getCell(`B${rowNum}`).alignment = { horizontal: 'center' };
                sheet2.getCell(`C${rowNum}`).alignment = { horizontal: 'center' };
                sheet2.getCell(`D${rowNum}`).alignment = { horizontal: 'center' };
            });
            
            // Total Row
            const totalRow2 = 4 + reportData.data.pegawaiByRole.length;
            sheet2.getCell(`A${totalRow2}`).value = 'TOTAL';
            sheet2.getCell(`B${totalRow2}`).value = reportData.data.pegawaiByRole.reduce((sum: number, item: any) => sum + item.jumlah, 0);
            sheet2.getCell(`C${totalRow2}`).value = reportData.data.pegawaiByRole.reduce((sum: number, item: any) => sum + item.aktif, 0);
            sheet2.getCell(`D${totalRow2}`).value = reportData.data.pegawaiByRole.reduce((sum: number, item: any) => sum + item.nonAktif, 0);
            
            ['A', 'B', 'C', 'D'].forEach(col => {
                const cell = sheet2.getCell(`${col}${totalRow2}`);
                cell.font = { bold: true };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC7D2FE' } };
                cell.border = {
                    top: { style: 'medium' },
                    left: { style: 'thin' },
                    bottom: { style: 'medium' },
                    right: { style: 'thin' }
                };
            });
            
            // Column widths
            sheet2.getColumn('A').width = 20;
            sheet2.getColumn('B').width = 15;
            sheet2.getColumn('C').width = 15;
            sheet2.getColumn('D').width = 15;
        }
        
        // ===== SHEET 3: PEGAWAI PER TOKO =====
        if (reportData.data.pegawaiByToko.length > 0) {
            const sheet3 = workbook.addWorksheet('Per Toko', {
                properties: { tabColor: { argb: 'FF6366F1' } }
            });
            
            // Title
            sheet3.mergeCells('A1:D1');
            const title3 = sheet3.getCell('A1');
            title3.value = 'PEGAWAI PER TOKO';
            title3.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FF6366F1' } };
            title3.alignment = { horizontal: 'center', vertical: 'middle' };
            
            // Table Header
            const headers3 = ['Toko', 'Total', 'Aktif', 'Non-Aktif'];
            headers3.forEach((header, idx) => {
                const cell = sheet3.getCell(3, idx + 1);
                cell.value = header;
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6366F1' } };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
            
            // Table Data
            reportData.data.pegawaiByToko.forEach((item: any, idx: number) => {
                const rowNum = 4 + idx;
                sheet3.getCell(`A${rowNum}`).value = item.toko;
                sheet3.getCell(`B${rowNum}`).value = item.jumlahPegawai;
                sheet3.getCell(`C${rowNum}`).value = item.aktif;
                sheet3.getCell(`D${rowNum}`).value = item.nonAktif;
                
                ['A', 'B', 'C', 'D'].forEach(col => {
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
                
                sheet3.getCell(`B${rowNum}`).alignment = { horizontal: 'center' };
                sheet3.getCell(`C${rowNum}`).alignment = { horizontal: 'center' };
                sheet3.getCell(`D${rowNum}`).alignment = { horizontal: 'center' };
            });
            
            // Total Row
            const totalRow3 = 4 + reportData.data.pegawaiByToko.length;
            sheet3.getCell(`A${totalRow3}`).value = 'TOTAL';
            sheet3.getCell(`B${totalRow3}`).value = reportData.data.pegawaiByToko.reduce((sum: number, item: any) => sum + item.jumlahPegawai, 0);
            sheet3.getCell(`C${totalRow3}`).value = reportData.data.pegawaiByToko.reduce((sum: number, item: any) => sum + item.aktif, 0);
            sheet3.getCell(`D${totalRow3}`).value = reportData.data.pegawaiByToko.reduce((sum: number, item: any) => sum + item.nonAktif, 0);
            
            ['A', 'B', 'C', 'D'].forEach(col => {
                const cell = sheet3.getCell(`${col}${totalRow3}`);
                cell.font = { bold: true };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC7D2FE' } };
                cell.border = {
                    top: { style: 'medium' },
                    left: { style: 'thin' },
                    bottom: { style: 'medium' },
                    right: { style: 'thin' }
                };
            });
            
            // Column widths
            sheet3.getColumn('A').width = 30;
            sheet3.getColumn('B').width = 15;
            sheet3.getColumn('C').width = 15;
            sheet3.getColumn('D').width = 15;
        }
        
        // ===== SHEET 4: DETAIL PEGAWAI =====
        if (reportData.data.pegawaiList.length > 0) {
            const sheet4 = workbook.addWorksheet('Detail Pegawai', {
                properties: { tabColor: { argb: 'FF6366F1' } }
            });
            
            // Title
            sheet4.mergeCells('A1:F1');
            const title4 = sheet4.getCell('A1');
            title4.value = 'DETAIL PEGAWAI';
            title4.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FF6366F1' } };
            title4.alignment = { horizontal: 'center', vertical: 'middle' };
            
            // Table Header
            const headers4 = ['Nama', 'Email', 'Role', 'Toko', 'Status', 'Terdaftar'];
            headers4.forEach((header, idx) => {
                const cell = sheet4.getCell(3, idx + 1);
                cell.value = header;
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6366F1' } };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
            
            // Table Data
            reportData.data.pegawaiList.forEach((item: any, idx: number) => {
                const rowNum = 4 + idx;
                sheet4.getCell(`A${rowNum}`).value = item.name;
                sheet4.getCell(`B${rowNum}`).value = item.email;
                sheet4.getCell(`C${rowNum}`).value = item.role;
                sheet4.getCell(`D${rowNum}`).value = item.toko;
                sheet4.getCell(`E${rowNum}`).value = item.isActive ? 'Aktif' : 'Non-Aktif';
                sheet4.getCell(`F${rowNum}`).value = new Date(item.createdAt).toLocaleDateString('id-ID');
                
                ['A', 'B', 'C', 'D', 'E', 'F'].forEach(col => {
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
                
                sheet4.getCell(`C${rowNum}`).alignment = { horizontal: 'center' };
                sheet4.getCell(`E${rowNum}`).alignment = { horizontal: 'center' };
                
                // Color status
                const statusCell = sheet4.getCell(`E${rowNum}`);
                if (item.isActive) {
                    statusCell.font = { bold: true, color: { argb: 'FF10B981' } };
                } else {
                    statusCell.font = { bold: true, color: { argb: 'FF9CA3AF' } };
                }
            });
            
            // Column widths
            sheet4.getColumn('A').width = 25;
            sheet4.getColumn('B').width = 30;
            sheet4.getColumn('C').width = 15;
            sheet4.getColumn('D').width = 25;
            sheet4.getColumn('E').width = 12;
            sheet4.getColumn('F').width = 15;
        }
        
        // Save Excel
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Laporan-Pegawai-${new Date().getTime()}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error in exportPegawaiExcel:', error);
        throw error;
    }
}

export async function exportPerformanceTokoPDF(reportData: any) {
    try {
        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');

        const doc = new jsPDF('landscape'); // Landscape untuk tabel yang lebar
        
        // Header
        doc.setFontSize(20);
        doc.setTextColor(48, 102, 119);
        doc.text('IMD Clothes', 14, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(95, 107, 111);
        doc.text('CV. Inti Media Digital', 14, 26);
        
        doc.setFontSize(16);
        doc.setTextColor(44, 52, 55);
        doc.text('Laporan Performance Toko', 14, 40);
        
        // Info
        const startDate = new Date(reportData.data.periode.start);
        const endDate = new Date(reportData.data.periode.end);
        doc.setFontSize(10);
        doc.setTextColor(95, 107, 111);
        doc.text(`Periode: ${startDate.toLocaleDateString('id-ID')} - ${endDate.toLocaleDateString('id-ID')}`, 14, 47);
        doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`, 14, 52);
        
        let yPos = 60;
        
        // Ringkasan
        doc.setFontSize(12);
        doc.setTextColor(44, 52, 55);
        doc.text('Ringkasan Performance', 14, yPos);
        yPos += 8;
        
        const ringkasanData = [
            ['Total Toko', `${reportData.data.ringkasan.totalToko} toko`],
            ['Total Revenue', formatRupiah(reportData.data.ringkasan.totalRevenue)],
            ['Total Penjualan', `${reportData.data.ringkasan.totalPenjualan} transaksi`],
            ['Total Qty Terjual', `${reportData.data.ringkasan.totalQtyTerjual.toLocaleString('id-ID')} pcs`],
            ['Rata-rata Revenue/Toko', formatRupiah(reportData.data.ringkasan.avgRevenuePerToko)]
        ];
        
        autoTable(doc, {
            startY: yPos,
            head: [['Metrik', 'Nilai']],
            body: ringkasanData,
            theme: 'grid',
            headStyles: { fillColor: [236, 72, 153], textColor: 255 },
            styles: { fontSize: 9 }
        });
        
        yPos = (doc as any).lastAutoTable.finalY + 10;
        
        // Ranking Performance
        doc.setFontSize(12);
        doc.setTextColor(44, 52, 55);
        doc.text('Ranking Performance Toko', 14, yPos);
        yPos += 8;
        
        const performanceData = reportData.data.performanceData.map((item: any) => [
            item.ranking,
            item.toko,
            `${item.totalPenjualan} trx`,
            formatRupiah(item.totalRevenue),
            `${item.totalQtyTerjual} pcs`,
            `${item.totalRetur} retur`,
            item.performanceScore.toFixed(1)
        ]);
        
        autoTable(doc, {
            startY: yPos,
            head: [['#', 'Toko', 'Penjualan', 'Revenue', 'Qty Terjual', 'Retur', 'Score']],
            body: performanceData,
            theme: 'striped',
            headStyles: { fillColor: [236, 72, 153], textColor: 255 },
            styles: { fontSize: 8 },
            columnStyles: {
                0: { halign: 'center', cellWidth: 10 },
                1: { cellWidth: 50 },
                2: { halign: 'center', cellWidth: 30 },
                3: { cellWidth: 40 },
                4: { halign: 'center', cellWidth: 30 },
                5: { halign: 'center', cellWidth: 25 },
                6: { halign: 'center', cellWidth: 20 }
            },
            didParseCell: function(data: any) {
                if (data.section === 'body' && data.column.index === 0) {
                    const ranking = parseInt(data.cell.raw);
                    if (ranking === 1) {
                        data.cell.styles.fillColor = [254, 240, 138]; // Gold
                        data.cell.styles.fontStyle = 'bold';
                    } else if (ranking === 2) {
                        data.cell.styles.fillColor = [229, 231, 235]; // Silver
                        data.cell.styles.fontStyle = 'bold';
                    } else if (ranking === 3) {
                        data.cell.styles.fillColor = [253, 224, 71]; // Bronze
                        data.cell.styles.fontStyle = 'bold';
                    }
                }
            }
        });
        
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
        
        doc.save(`Laporan-Performance-Toko-${new Date().getTime()}.pdf`);
    } catch (error) {
        console.error('Error in exportPerformanceTokoPDF:', error);
        throw error;
    }
}

export async function exportPerformanceTokoExcel(reportData: any) {
    try {
        const ExcelJS = await import('exceljs');
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'IMD Clothes';
        workbook.created = new Date();
        
        // ===== SHEET 1: RINGKASAN =====
        const sheet1 = workbook.addWorksheet('Ringkasan', {
            properties: { tabColor: { argb: 'FFEC4899' } }
        });
        
        // Title
        sheet1.mergeCells('A1:B1');
        const titleCell = sheet1.getCell('A1');
        titleCell.value = 'LAPORAN PERFORMANCE TOKO';
        titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFEC4899' } };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        
        sheet1.mergeCells('A2:B2');
        const subtitleCell = sheet1.getCell('A2');
        subtitleCell.value = 'IMD Clothes - CV. Inti Media Digital';
        subtitleCell.font = { name: 'Calibri', size: 11, color: { argb: 'FF5f6b6f' } };
        subtitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        
        // Info
        sheet1.getCell('A4').value = 'Periode';
        sheet1.getCell('B4').value = `${new Date(reportData.data.periode.start).toLocaleDateString('id-ID')} - ${new Date(reportData.data.periode.end).toLocaleDateString('id-ID')}`;
        sheet1.getCell('A5').value = 'Dicetak';
        sheet1.getCell('B5').value = `${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`;
        
        // Ringkasan Section
        sheet1.mergeCells('A7:B7');
        const ringkasanTitle = sheet1.getCell('A7');
        ringkasanTitle.value = 'RINGKASAN PERFORMANCE';
        ringkasanTitle.font = { name: 'Calibri', size: 12, bold: true };
        ringkasanTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFCE7F3' } };
        ringkasanTitle.alignment = { horizontal: 'center', vertical: 'middle' };
        
        // Table Header
        sheet1.getCell('A8').value = 'Metrik';
        sheet1.getCell('B8').value = 'Nilai';
        ['A8', 'B8'].forEach(cell => {
            const c = sheet1.getCell(cell);
            c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEC4899' } };
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
            ['Total Toko', `${reportData.data.ringkasan.totalToko} toko`],
            ['Total Revenue', reportData.data.ringkasan.totalRevenue],
            ['Total Penjualan', `${reportData.data.ringkasan.totalPenjualan} transaksi`],
            ['Total Qty Terjual', `${reportData.data.ringkasan.totalQtyTerjual.toLocaleString('id-ID')} pcs`],
            ['Rata-rata Revenue/Toko', reportData.data.ringkasan.avgRevenuePerToko]
        ];
        
        ringkasanData.forEach((row, idx) => {
            const rowNum = 9 + idx;
            sheet1.getCell(`A${rowNum}`).value = row[0];
            sheet1.getCell(`B${rowNum}`).value = row[1];
            
            if (idx === 1 || idx === 4) {
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
        
        // ===== SHEET 2: RANKING PERFORMANCE =====
        const sheet2 = workbook.addWorksheet('Ranking Performance', {
            properties: { tabColor: { argb: 'FFEC4899' } }
        });
        
        // Title
        sheet2.mergeCells('A1:J1');
        const title2 = sheet2.getCell('A1');
        title2.value = 'RANKING PERFORMANCE TOKO';
        title2.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFEC4899' } };
        title2.alignment = { horizontal: 'center', vertical: 'middle' };
        
        // Table Header
        const headers2 = ['Rank', 'Toko', 'Penjualan', 'Revenue', 'Qty Terjual', 'Distribusi', 'Retur', 'Stok', 'Stok Menipis', 'Score'];
        headers2.forEach((header, idx) => {
            const cell = sheet2.getCell(3, idx + 1);
            cell.value = header;
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEC4899' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
        
        // Table Data
        reportData.data.performanceData.forEach((item: any, idx: number) => {
            const rowNum = 4 + idx;
            sheet2.getCell(`A${rowNum}`).value = item.ranking;
            sheet2.getCell(`B${rowNum}`).value = item.toko;
            sheet2.getCell(`C${rowNum}`).value = item.totalPenjualan;
            sheet2.getCell(`D${rowNum}`).value = item.totalRevenue;
            sheet2.getCell(`D${rowNum}`).numFmt = '"Rp "#,##0';
            sheet2.getCell(`E${rowNum}`).value = item.totalQtyTerjual;
            sheet2.getCell(`F${rowNum}`).value = item.distribusiDiterima;
            sheet2.getCell(`G${rowNum}`).value = item.totalRetur;
            sheet2.getCell(`H${rowNum}`).value = item.totalStok;
            sheet2.getCell(`I${rowNum}`).value = item.stokMenipis;
            sheet2.getCell(`J${rowNum}`).value = item.performanceScore;
            
            ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].forEach(col => {
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
            
            // Center align numeric columns
            ['A', 'C', 'E', 'F', 'G', 'H', 'I', 'J'].forEach(col => {
                sheet2.getCell(`${col}${rowNum}`).alignment = { horizontal: 'center' };
            });
            
            // Highlight top 3
            const rankCell = sheet2.getCell(`A${rowNum}`);
            if (item.ranking === 1) {
                rankCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF08A' } }; // Gold
                rankCell.font = { bold: true };
            } else if (item.ranking === 2) {
                rankCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE5E7EB' } }; // Silver
                rankCell.font = { bold: true };
            } else if (item.ranking === 3) {
                rankCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFDE047' } }; // Bronze
                rankCell.font = { bold: true };
            }
            
            // Color score
            const scoreCell = sheet2.getCell(`J${rowNum}`);
            scoreCell.font = { bold: true };
            if (item.performanceScore >= 50) {
                scoreCell.font = { bold: true, color: { argb: 'FF10B981' } };
            } else if (item.performanceScore >= 30) {
                scoreCell.font = { bold: true, color: { argb: 'FFF59E0B' } };
            } else {
                scoreCell.font = { bold: true, color: { argb: 'FFDC2626' } };
            }
        });
        
        // Column widths
        sheet2.getColumn('A').width = 8;
        sheet2.getColumn('B').width = 25;
        sheet2.getColumn('C').width = 12;
        sheet2.getColumn('D').width = 20;
        sheet2.getColumn('E').width = 12;
        sheet2.getColumn('F').width = 12;
        sheet2.getColumn('G').width = 10;
        sheet2.getColumn('H').width = 10;
        sheet2.getColumn('I').width = 14;
        sheet2.getColumn('J').width = 10;
        
        // ===== SHEET 3: TOP 3 TOKO =====
        if (reportData.data.top3.length > 0) {
            const sheet3 = workbook.addWorksheet('Top 3 Toko', {
                properties: { tabColor: { argb: 'FF10B981' } }
            });
            
            // Title
            sheet3.mergeCells('A1:J1');
            const title3 = sheet3.getCell('A1');
            title3.value = 'TOP 3 TOKO TERBAIK';
            title3.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FF10B981' } };
            title3.alignment = { horizontal: 'center', vertical: 'middle' };
            
            // Table Header
            const headers3 = ['Rank', 'Toko', 'Penjualan', 'Revenue', 'Qty Terjual', 'Distribusi', 'Retur', 'Stok', 'Stok Menipis', 'Score'];
            headers3.forEach((header, idx) => {
                const cell = sheet3.getCell(3, idx + 1);
                cell.value = header;
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
            
            // Table Data
            reportData.data.top3.forEach((item: any, idx: number) => {
                const rowNum = 4 + idx;
                sheet3.getCell(`A${rowNum}`).value = item.ranking;
                sheet3.getCell(`B${rowNum}`).value = item.toko;
                sheet3.getCell(`C${rowNum}`).value = item.totalPenjualan;
                sheet3.getCell(`D${rowNum}`).value = item.totalRevenue;
                sheet3.getCell(`D${rowNum}`).numFmt = '"Rp "#,##0';
                sheet3.getCell(`E${rowNum}`).value = item.totalQtyTerjual;
                sheet3.getCell(`F${rowNum}`).value = item.distribusiDiterima;
                sheet3.getCell(`G${rowNum}`).value = item.totalRetur;
                sheet3.getCell(`H${rowNum}`).value = item.totalStok;
                sheet3.getCell(`I${rowNum}`).value = item.stokMenipis;
                sheet3.getCell(`J${rowNum}`).value = item.performanceScore;
                
                ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].forEach(col => {
                    const cell = sheet3.getCell(`${col}${rowNum}`);
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1FAE5' } };
                });
                
                ['A', 'C', 'E', 'F', 'G', 'H', 'I', 'J'].forEach(col => {
                    sheet3.getCell(`${col}${rowNum}`).alignment = { horizontal: 'center' };
                });
                
                sheet3.getCell(`J${rowNum}`).font = { bold: true, color: { argb: 'FF10B981' } };
            });
            
            // Column widths
            sheet3.getColumn('A').width = 8;
            sheet3.getColumn('B').width = 25;
            sheet3.getColumn('C').width = 12;
            sheet3.getColumn('D').width = 20;
            sheet3.getColumn('E').width = 12;
            sheet3.getColumn('F').width = 12;
            sheet3.getColumn('G').width = 10;
            sheet3.getColumn('H').width = 10;
            sheet3.getColumn('I').width = 14;
            sheet3.getColumn('J').width = 10;
        }
        
        // Save Excel
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Laporan-Performance-Toko-${new Date().getTime()}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error in exportPerformanceTokoExcel:', error);
        throw error;
    }
}

export async function exportInvoicePDF(reportData: any) {
    try {
        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');

        const doc = new jsPDF();
        
        // Header - Invoice
        doc.setFontSize(24);
        doc.setTextColor(48, 102, 119);
        doc.text('INVOICE', 14, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(95, 107, 111);
        doc.text('IMD Clothes - CV. Inti Media Digital', 14, 28);
        
        // Invoice Number & Date
        doc.setFontSize(10);
        doc.setTextColor(44, 52, 55);
        doc.text(`No. Invoice: INV-${reportData.data.distribusi.id.toString().padStart(6, '0')}`, 14, 40);
        doc.text(`Tanggal: ${new Date(reportData.data.distribusi.tanggal).toLocaleDateString('id-ID')}`, 14, 46);
        doc.text(`Status: ${reportData.data.distribusi.status}`, 14, 52);
        
        // From & To
        let yPos = 65;
        
        doc.setFontSize(11);
        doc.setTextColor(44, 52, 55);
        doc.setFont(undefined, 'bold');
        doc.text('DARI:', 14, yPos);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        doc.text(reportData.data.tokoAsal.nama, 14, yPos + 6);
        doc.setTextColor(95, 107, 111);
        doc.text(reportData.data.tokoAsal.alamat || '-', 14, yPos + 12);
        
        doc.setFontSize(11);
        doc.setTextColor(44, 52, 55);
        doc.setFont(undefined, 'bold');
        doc.text('KEPADA:', 120, yPos);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        doc.text(reportData.data.tokoTujuan.nama, 120, yPos + 6);
        doc.setTextColor(95, 107, 111);
        doc.text(reportData.data.tokoTujuan.alamat || '-', 120, yPos + 12);
        
        yPos += 25;
        
        // Items Table
        doc.setFontSize(12);
        doc.setTextColor(44, 52, 55);
        doc.setFont(undefined, 'bold');
        doc.text('DETAIL BARANG', 14, yPos);
        yPos += 8;
        
        const itemData = reportData.data.items.map((item: any, idx: number) => [
            idx + 1,
            item.kategori,
            `${item.jumlah} pcs`,
            formatRupiah(item.hargaModal),
            formatRupiah(item.subtotal)
        ]);
        
        autoTable(doc, {
            startY: yPos,
            head: [['#', 'Nama Barang', 'Qty', 'Harga Satuan', 'Subtotal']],
            body: itemData,
            theme: 'grid',
            headStyles: { fillColor: [48, 102, 119], textColor: 255, fontStyle: 'bold' },
            styles: { fontSize: 9 },
            columnStyles: {
                0: { halign: 'center', cellWidth: 10 },
                1: { cellWidth: 70 },
                2: { halign: 'center', cellWidth: 25 },
                3: { halign: 'right', cellWidth: 35 },
                4: { halign: 'right', cellWidth: 40 }
            }
        });
        
        yPos = (doc as any).lastAutoTable.finalY + 5;
        
        // Total
        doc.setFillColor(48, 102, 119);
        doc.rect(130, yPos, 70, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont(undefined, 'bold');
        doc.text('TOTAL:', 135, yPos + 5);
        doc.text(formatRupiah(reportData.data.totalNilai), 195, yPos + 5, { align: 'right' });
        
        yPos += 15;
        
        // Keterangan
        if (reportData.data.distribusi.keterangan) {
            doc.setTextColor(44, 52, 55);
            doc.setFont(undefined, 'bold');
            doc.setFontSize(10);
            doc.text('Keterangan:', 14, yPos);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(95, 107, 111);
            doc.text(reportData.data.distribusi.keterangan, 14, yPos + 6);
            yPos += 15;
        }
        
        // Signature Section
        yPos = Math.max(yPos, 220);
        
        doc.setFontSize(9);
        doc.setTextColor(44, 52, 55);
        
        // Dibuat Oleh
        doc.text('Dibuat Oleh,', 20, yPos);
        doc.line(14, yPos + 20, 60, yPos + 20);
        doc.text(reportData.data.createdBy, 37, yPos + 25, { align: 'center' });
        
        // Diterima Oleh
        doc.text('Diterima Oleh,', 90, yPos);
        doc.line(84, yPos + 20, 130, yPos + 20);
        doc.text('(............................)', 107, yPos + 25, { align: 'center' });
        
        // Disetujui Oleh
        doc.text('Disetujui Oleh,', 160, yPos);
        doc.line(154, yPos + 20, 200, yPos + 20);
        doc.text('(............................)', 177, yPos + 25, { align: 'center' });
        
        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
            `Dicetak pada ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
        );
        
        doc.save(`Invoice-${reportData.data.distribusi.id}-${new Date().getTime()}.pdf`);
    } catch (error) {
        console.error('Error in exportInvoicePDF:', error);
        throw error;
    }
}

export async function exportSuratJalanPDF(reportData: any) {
    try {
        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');

        const doc = new jsPDF();
        
        // Header - Surat Jalan
        doc.setFontSize(24);
        doc.setTextColor(48, 102, 119);
        doc.text('SURAT JALAN', 14, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(95, 107, 111);
        doc.text('IMD Clothes - CV. Inti Media Digital', 14, 28);
        
        // Surat Jalan Number & Date
        doc.setFontSize(10);
        doc.setTextColor(44, 52, 55);
        doc.text(`No. Surat Jalan: SJ-${reportData.data.distribusi.id.toString().padStart(6, '0')}`, 14, 40);
        doc.text(`Tanggal: ${new Date(reportData.data.distribusi.tanggal).toLocaleDateString('id-ID')}`, 14, 46);
        doc.text(`Status: ${reportData.data.distribusi.status}`, 14, 52);
        
        // From & To
        let yPos = 65;
        
        doc.setFontSize(11);
        doc.setTextColor(44, 52, 55);
        doc.setFont(undefined, 'bold');
        doc.text('PENGIRIM:', 14, yPos);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        doc.text(reportData.data.tokoAsal.nama, 14, yPos + 6);
        doc.setTextColor(95, 107, 111);
        doc.text(reportData.data.tokoAsal.alamat || '-', 14, yPos + 12);
        
        doc.setFontSize(11);
        doc.setTextColor(44, 52, 55);
        doc.setFont(undefined, 'bold');
        doc.text('PENERIMA:', 120, yPos);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        doc.text(reportData.data.tokoTujuan.nama, 120, yPos + 6);
        doc.setTextColor(95, 107, 111);
        doc.text(reportData.data.tokoTujuan.alamat || '-', 120, yPos + 12);
        
        yPos += 25;
        
        // Items Table
        doc.setFontSize(12);
        doc.setTextColor(44, 52, 55);
        doc.setFont(undefined, 'bold');
        doc.text('DAFTAR BARANG', 14, yPos);
        yPos += 8;
        
        const itemData = reportData.data.items.map((item: any, idx: number) => [
            idx + 1,
            item.kategori,
            `${item.jumlah} pcs`,
            '[ ]' // Checkbox untuk konfirmasi
        ]);
        
        autoTable(doc, {
            startY: yPos,
            head: [['#', 'Nama Barang', 'Jumlah', 'Diterima']],
            body: itemData,
            theme: 'grid',
            headStyles: { fillColor: [48, 102, 119], textColor: 255, fontStyle: 'bold' },
            styles: { fontSize: 10 },
            columnStyles: {
                0: { halign: 'center', cellWidth: 15 },
                1: { cellWidth: 100 },
                2: { halign: 'center', cellWidth: 35 },
                3: { halign: 'center', cellWidth: 30 }
            }
        });
        
        yPos = (doc as any).lastAutoTable.finalY + 10;
        
        // Summary Box
        doc.setDrawColor(48, 102, 119);
        doc.setLineWidth(0.5);
        doc.rect(14, yPos, 182, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(44, 52, 55);
        doc.setFont(undefined, 'bold');
        doc.text('Total Item:', 20, yPos + 8);
        doc.setFont(undefined, 'normal');
        doc.text(`${reportData.data.totalItem} pcs`, 50, yPos + 8);
        
        doc.setFont(undefined, 'bold');
        doc.text('Total Kategori:', 20, yPos + 15);
        doc.setFont(undefined, 'normal');
        doc.text(`${reportData.data.items.length} kategori`, 50, yPos + 15);
        
        yPos += 30;
        
        // Keterangan
        if (reportData.data.distribusi.keterangan) {
            doc.setTextColor(44, 52, 55);
            doc.setFont(undefined, 'bold');
            doc.setFontSize(10);
            doc.text('Keterangan:', 14, yPos);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(95, 107, 111);
            doc.text(reportData.data.distribusi.keterangan, 14, yPos + 6);
            yPos += 15;
        }
        
        // Notes
        doc.setFontSize(9);
        doc.setTextColor(220, 38, 38);
        doc.setFont(undefined, 'italic');
        doc.text('* Mohon periksa kondisi barang saat diterima', 14, yPos);
        doc.text('* Segera laporkan jika ada kerusakan atau kekurangan', 14, yPos + 5);
        
        // Signature Section
        yPos = Math.max(yPos + 15, 220);
        
        doc.setFontSize(9);
        doc.setTextColor(44, 52, 55);
        doc.setFont(undefined, 'normal');
        
        // Pengirim
        doc.text('Pengirim,', 30, yPos);
        doc.line(20, yPos + 20, 70, yPos + 20);
        doc.text(reportData.data.createdBy, 45, yPos + 25, { align: 'center' });
        doc.setFontSize(7);
        doc.setTextColor(95, 107, 111);
        doc.text(`Tanggal: ${new Date(reportData.data.distribusi.tanggal).toLocaleDateString('id-ID')}`, 45, yPos + 30, { align: 'center' });
        
        // Penerima
        doc.setFontSize(9);
        doc.setTextColor(44, 52, 55);
        doc.text('Penerima,', 100, yPos);
        doc.line(90, yPos + 20, 140, yPos + 20);
        doc.text('(............................)', 115, yPos + 25, { align: 'center' });
        doc.setFontSize(7);
        doc.setTextColor(95, 107, 111);
        doc.text('Tanggal: ___/___/______', 115, yPos + 30, { align: 'center' });
        
        // Sopir/Kurir
        doc.setFontSize(9);
        doc.setTextColor(44, 52, 55);
        doc.text('Sopir/Kurir,', 165, yPos);
        doc.line(155, yPos + 20, 205, yPos + 20);
        doc.text('(............................)', 180, yPos + 25, { align: 'center' });
        doc.setFontSize(7);
        doc.setTextColor(95, 107, 111);
        doc.text('No. Kendaraan: __________', 180, yPos + 30, { align: 'center' });
        
        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
            `Dicetak pada ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
        );
        
        doc.save(`Surat-Jalan-${reportData.data.distribusi.id}-${new Date().getTime()}.pdf`);
    } catch (error) {
        console.error('Error in exportSuratJalanPDF:', error);
        throw error;
    }
}
