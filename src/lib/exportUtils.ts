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
                sheet2.getCell(`D${rowNum}`).numFmt = 'Rp #,##0';
                
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
            sheet2.getCell(`D${totalRow}`).numFmt = 'Rp #,##0';
            
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
            sheet2.getColumn('D').width = 20;
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
                sheet4.getCell(`B${rowNum}`).numFmt = 'Rp #,##0';
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
            sheet4.getCell(`B${totalRow4}`).numFmt = 'Rp #,##0';
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
            sheet4.getColumn('B').width = 25;
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
