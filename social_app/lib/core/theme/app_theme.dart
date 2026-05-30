import 'package:flutter/material.dart';

class AppTheme {
  // Light Mode: Soft Violet
  static final ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: const Color(0xFF9C27B0), // Soft Violet
      brightness: Brightness.light,
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: Color(0xFF9C27B0),
      foregroundColor: Colors.white,
    ),
  );

  // Dark Mode: Neon/Futuristic
  static final ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: const Color(0xFF00E5FF), // Neon Cyan
      brightness: Brightness.dark,
      background: Colors.black,
      surface: const Color(0xFF121212),
    ),
    scaffoldBackgroundColor: Colors.black,
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.black,
      foregroundColor: Color(0xFF00E5FF),
    ),
  );
}
