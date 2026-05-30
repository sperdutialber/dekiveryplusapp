import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:firebase_core/firebase_core.dart';
import 'core/theme/app_theme.dart';
import 'routes.dart';
import 'data/services/auth_service.dart';
import 'data/repositories/i_repository.dart';
import 'data/repositories/mock_repository.dart';
import 'data/repositories/mariadb_repository.dart'; // Importa MariaDB

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Firebase
  // Note: For actual production, you must run `flutterfire configure` to generate firebase_options.dart
  try {
    await Firebase.initializeApp();
  } catch (e) {
    debugPrint('Firebase initialization failed (likely missing configuration): $e');
  }

  runApp(
    MultiProvider(
      providers: [
        Provider<AuthService>(create: (_) => AuthService()),

        // --- CONFIGURACIÓN DE REPOSITORIO ---
        // Para usar MariaDB, comenta la línea de MockRepository y desconecta la de MariaDBRepository

        Provider<IRepository>(create: (_) => MockRepository()),

        /*
        Provider<IRepository>(create: (_) => MariaDBRepository(
          host: 'TU_IP_LOCAL', // Ej: '192.168.1.50'
          port: 3306,
          user: 'root',
          password: 'TU_PASSWORD',
          db: 'social_app',
        )),
        */
      ],
      child: const SocialApp(),
    ),
  );
}

class SocialApp extends StatelessWidget {
  const SocialApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Social App',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      initialRoute: AppRoutes.login,
      routes: AppRoutes.getRoutes(),
      debugShowCheckedModeBanner: false,
    );
  }
}
