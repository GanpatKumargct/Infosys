package com.wellnest.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.properties.TextAlignment;
import com.wellnest.model.MedicalRecord;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class MedicalRecordPdfService {

    public byte[] generateRecordPdf(MedicalRecord record) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        
        try {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            String titleText = "WELLNEST MEDICAL " + record.getRecordType().replace("_", " ");
            Paragraph title = new Paragraph(titleText)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(20)
                    .setBold();
            document.add(title);

            document.add(new Paragraph("\n"));

            // Patient Info
            document.add(new Paragraph()
                    .add(new Text("Patient Name: ").setBold())
                    .add(record.getPatient().getFullName()));
            
            document.add(new Paragraph()
                    .add(new Text("Doctor Name: ").setBold())
                    .add(record.getDoctor().getFullName() + " (" + record.getDoctor().getSpecialization() + ")"));

            document.add(new Paragraph()
                    .add(new Text("Date: ").setBold())
                    .add(record.getCreatedAt().toString().substring(0, 10)));

            document.add(new Paragraph("\n------------------------------------------------------------------\n"));

            // Content
            document.add(new Paragraph()
                    .add(new Text("Details:").setBold().setUnderline()));
            document.add(new Paragraph(record.getContent()));

            document.add(new Paragraph("\n------------------------------------------------------------------\n"));
            
            Paragraph footer = new Paragraph("This is a computer generated document.")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(10)
                    .setItalic();
            document.add(footer);

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return baos.toByteArray();
    }

    public byte[] generateFullHistoryPdf(List<MedicalRecord> records, com.wellnest.model.User patient) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        
        try {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            Paragraph title = new Paragraph("WELLNEST MEDICAL HISTORY REPORT")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(22)
                    .setBold();
            document.add(title);

            document.add(new Paragraph("\n"));

            // Patient Info Header
            document.add(new Paragraph()
                    .add(new Text("Patient Name: ").setBold())
                    .add(patient.getFullName()));
            document.add(new Paragraph()
                    .add(new Text("Report Date: ").setBold())
                    .add(java.time.LocalDateTime.now().toString().substring(0, 10)));
            document.add(new Paragraph()
                    .add(new Text("Total Records: ").setBold())
                    .add(String.valueOf(records.size())));

            document.add(new Paragraph("\n------------------------------------------------------------------\n"));

            for (MedicalRecord record : records) {
                document.add(new Paragraph()
                        .add(new Text("Type: ").setBold())
                        .add(record.getRecordType().replace("_", " "))
                        .add(new Text("  |  Date: ").setBold())
                        .add(record.getCreatedAt().toString().substring(0, 10)));
                
                document.add(new Paragraph()
                        .add(new Text("Doctor: ").setBold())
                        .add(record.getDoctor().getFullName()));

                document.add(new Paragraph(record.getContent()));
                document.add(new Paragraph("\n" + "-".repeat(40) + "\n"));
            }

            Paragraph footer = new Paragraph("End of Medical History Report.")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(10)
                    .setItalic();
            document.add(footer);

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return baos.toByteArray();
    }
}
