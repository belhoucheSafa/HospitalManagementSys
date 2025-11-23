package com.hospital.controllers;

import com.hospital.App;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.layout.BorderPane;
import java.io.IOException;

public class MainLayoutController {

    @FXML
    private BorderPane mainLayout;

    @FXML
    public void initialize() {
        // Load Dashboard by default
        loadView("dashboard");
    }

    @FXML
    private void showDashboard() { loadView("dashboard"); }

    @FXML
    private void showPatients() { loadView("patients"); }

    @FXML
    private void showAppointments() { loadView("appointments"); }

    @FXML
    private void showStaff() { loadView("staff"); }

    @FXML
    private void handleLogout() throws IOException {
        App.setRoot("views/login");
    }

    private void loadView(String viewName) {
        try {
            FXMLLoader loader = new FXMLLoader(App.class.getResource("views/" + viewName + ".fxml"));
            Parent view = loader.load();
            mainLayout.setCenter(view);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
