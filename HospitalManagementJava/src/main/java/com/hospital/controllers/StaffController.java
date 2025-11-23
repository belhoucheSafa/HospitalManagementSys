package com.hospital.controllers;

import com.hospital.models.Doctor;
import com.hospital.services.DataService;
import javafx.collections.FXCollections;
import javafx.fxml.FXML;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.PropertyValueFactory;

public class StaffController {
    @FXML private TableView<Doctor> staffTable;
    @FXML private TableColumn<Doctor, String> nameColumn;
    @FXML private TableColumn<Doctor, String> specialtyColumn;
    @FXML private TableColumn<Doctor, String> contactColumn;
    @FXML private TableColumn<Doctor, String> availabilityColumn;

    @FXML
    public void initialize() {
        nameColumn.setCellValueFactory(new PropertyValueFactory<>("name"));
        specialtyColumn.setCellValueFactory(new PropertyValueFactory<>("specialty"));
        contactColumn.setCellValueFactory(new PropertyValueFactory<>("contact"));
        availabilityColumn.setCellValueFactory(new PropertyValueFactory<>("availability"));

        staffTable.setItems(FXCollections.observableArrayList(DataService.getInstance().getDoctors()));
    }
}
