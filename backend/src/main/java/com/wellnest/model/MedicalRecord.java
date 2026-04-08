package com.wellnest.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "medical_records")
public class MedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private User doctor;

    private String recordType; // PRESCRIPTION, LAB_RESULT, VISIT_NOTE
    
    @Column(columnDefinition = "TEXT")
    private String content; // The actual prescription details or note

    private String attachmentUrl; // For uploaded files (PDFs, images)

    private LocalDateTime createdAt;
}
