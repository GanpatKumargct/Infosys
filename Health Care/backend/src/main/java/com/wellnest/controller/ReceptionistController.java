package com.wellnest.controller;

import com.wellnest.model.User;
import com.wellnest.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/receptionist")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReceptionistController {

    private final UserService userService;

    // Doctor Management
    @GetMapping("/doctors")
    public ResponseEntity<List<User>> getAllDoctors() {
        return ResponseEntity.ok(userService.getDoctors());
    }

    @PostMapping("/doctors")
    public ResponseEntity<User> createDoctor(@RequestBody User doctor) {
        return ResponseEntity.ok(userService.createDoctor(doctor));
    }

    @PutMapping("/doctors/{id}")
    public ResponseEntity<User> updateDoctor(@PathVariable Long id, @RequestBody User doctor) {
        return ResponseEntity.ok(userService.updateDoctor(id, doctor));
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        userService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }

    // Patient Management
    @GetMapping("/patients")
    public ResponseEntity<List<User>> getAllPatients() {
        return ResponseEntity.ok(userService.getPatients());
    }

    @PostMapping("/patients")
    public ResponseEntity<User> registerPatient(@RequestBody User patient) {
        return ResponseEntity.ok(userService.registerPatient(patient));
    }

    @PutMapping("/patients/{id}")
    public ResponseEntity<User> updatePatient(@PathVariable Long id, @RequestBody User patient) {
        return ResponseEntity.ok(userService.updatePatient(id, patient));
    }

    @DeleteMapping("/patients/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        userService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }
}
