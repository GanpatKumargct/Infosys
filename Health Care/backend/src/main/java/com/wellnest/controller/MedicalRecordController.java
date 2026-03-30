package com.wellnest.controller;

import com.wellnest.model.MedicalRecord;
import com.wellnest.model.User;
import com.wellnest.service.MedicalRecordPdfService;
import com.wellnest.service.MedicalRecordService;
import com.wellnest.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/records")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;
    private final UserService userService;
    private final MedicalRecordPdfService pdfService;

    @PostMapping("/doctor/add")
    public ResponseEntity<MedicalRecord> addRecord(@RequestParam Long patientId, @RequestBody MedicalRecord record) {
        User doctor = userService.getCurrentUser();
        return ResponseEntity.ok(medicalRecordService.createRecord(patientId, doctor.getId(), record));
    }

    @GetMapping("/patient")
    public ResponseEntity<List<MedicalRecord>> getMyRecords() {
        User patient = userService.getCurrentUser();
        return ResponseEntity.ok(medicalRecordService.getRecordsByPatient(patient.getId()));
    }
    
    @GetMapping("/doctor/patient/{patientId}")
    public ResponseEntity<List<MedicalRecord>> getPatientRecords(@PathVariable Long patientId) {
        // In a real app, verify doctor-patient relationship
        return ResponseEntity.ok(medicalRecordService.getRecordsByPatient(patientId));
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadRecord(@PathVariable Long id) {
        MedicalRecord record = medicalRecordService.getRecordById(id);
        byte[] pdfBytes = pdfService.generateRecordPdf(record);

        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=" + record.getRecordType().toLowerCase() + "_" + id + ".pdf")
                .body(pdfBytes);
    }

    @GetMapping("/download/patient/{patientId}/all")
    public ResponseEntity<byte[]> downloadFullHistory(@PathVariable Long patientId) {
        User patient = userService.getUserById(patientId);
        List<MedicalRecord> records = medicalRecordService.getRecordsByPatient(patientId);
        byte[] pdfBytes = pdfService.generateFullHistoryPdf(records, patient);

        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=medical_history_" + patientId + ".pdf")
                .body(pdfBytes);
    }

    @GetMapping("/download/me/all")
    public ResponseEntity<byte[]> downloadMyFullHistory() {
        User patient = userService.getCurrentUser();
        List<MedicalRecord> records = medicalRecordService.getRecordsByPatient(patient.getId());
        byte[] pdfBytes = pdfService.generateFullHistoryPdf(records, patient);

        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=my_medical_history.pdf")
                .body(pdfBytes);
    }
}
