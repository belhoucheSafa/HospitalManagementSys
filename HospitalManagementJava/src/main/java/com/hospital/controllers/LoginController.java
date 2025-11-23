package com.hospital.controllers;

import com.hospital.App;
import com.hospital.models.User;
import com.hospital.services.DataService;
import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;

import java.io.IOException;

public class LoginController {

    @FXML
    private TextField emailField;

    @FXML
    private PasswordField passwordField;

    @FXML
    private Label errorLabel;

    @FXML
    private void handleLogin() throws IOException {
        String email = emailField.getText();
        String password = passwordField.getText();

        User user = DataService.getInstance().authenticate(email, password);

        if (user != null) {
            // Store user in session if needed, for now just navigate
            App.setRoot("views/main_layout");
        } else {
            errorLabel.setText("Invalid credentials");
            errorLabel.setVisible(true);
        }
    }
}
