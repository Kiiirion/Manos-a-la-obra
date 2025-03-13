import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  registroForm: FormGroup;
  recuperarForm: FormGroup;
  mostrarRecuperar = false;
  mostrarRegistro = false; // Este valor se mantendrá como `false` al inicio
  mensajeError = '';
  mensajeExito = '';

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required],
    });

    this.registroForm = this.fb.group(
      {
        nuevoUsuario: ['', Validators.required],
        nuevaContrasena: ['', Validators.required],
        confirmarContrasena: ['', Validators.required], // Campo de confirmación de contraseña
        correo: ['', [Validators.required, Validators.email]],
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        edad: ['', [Validators.required, Validators.min(1)]],
      },
      {
        validators: this.passwordMatchValidator, // Validación de contraseñas
      }
    );

    this.recuperarForm = this.fb.group({
      correoRecuperar: ['', [Validators.required, Validators.email]],
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('nuevaContrasena')?.value;
    const confirmPassword = group.get('confirmarContrasena')?.value;
    return password === confirmPassword ? null : { passwordsNotMatching: true };
  }

  iniciarSesion() {
    if (this.loginForm.valid) {
      const { usuario, contrasena } = this.loginForm.value;
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const usuarioEncontrado = usuarios.find(
        (u: any) => u.usuario === usuario && u.contrasena === contrasena
      );

      if (usuarioEncontrado) {
        this.mensajeExito = 'Inicio de sesión exitoso';
        this.mensajeError = '';
        // Redirigir a la página principal
      } else {
        this.mensajeError = 'Usuario o contraseña incorrectos';
        this.mensajeExito = '';
      }
    } else {
      this.mensajeError = 'Por favor, complete todos los campos';
      this.mensajeExito = '';
    }
  }

  registrarUsuario() {
    if (this.registroForm.valid) {
      const { nuevoUsuario, nuevaContrasena, correo, nombre, apellido, edad } =
        this.registroForm.value;
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const usuarioExistente = usuarios.find(
        (u: any) => u.usuario === nuevoUsuario
      );

      if (usuarioExistente) {
        this.mensajeError = 'El usuario ya existe';
        this.mensajeExito = '';
      } else {
        usuarios.push({
          usuario: nuevoUsuario,
          contrasena: nuevaContrasena,
          correo,
          nombre,
          apellido,
          edad,
        });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        this.mensajeExito = 'Registro exitoso';
        this.mensajeError = '';
        this.toggleRegistro(); // Cambiar al formulario de inicio de sesión
      }
    } else {
      this.mensajeError = 'Por favor, complete todos los campos';
      this.mensajeExito = '';
    }
  }

  recuperarContrasena() {
    if (this.recuperarForm.valid) {
      const { correoRecuperar } = this.recuperarForm.value;
      // Simulación de recuperación de contraseña (reemplaza con tu lógica de backend)
      console.log('Recuperar contraseña:', correoRecuperar);
      this.mensajeExito = 'Correo de recuperación enviado';
      this.mensajeError = '';
    } else {
      this.mensajeError = 'Por favor, ingrese un correo válido';
      this.mensajeExito = '';
    }
  }

  toggleRecuperarContrasena() {
    this.mostrarRecuperar = !this.mostrarRecuperar;
  }

  toggleRegistro() {
    this.mostrarRegistro = !this.mostrarRegistro;
    this.mensajeError = ''; // Limpiar mensajes de error al cambiar de formulario
    this.mensajeExito = '';
  }

  limpiarRegistro() {
    this.registroForm.reset();
  }
}
