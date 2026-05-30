import 'package:mysql1/mysql1.dart';
import '../models/post_model.dart';
import '../models/reward_model.dart';
import '../models/user_model.dart';
import '../models/venue_model.dart';
import 'i_repository.dart';

class MariaDBRepository implements IRepository {
  final ConnectionSettings settings;

  MariaDBRepository({
    required String host,
    required int port,
    required String user,
    String? password,
    String? db,
  }) : settings = ConnectionSettings(
          host: host,
          port: port,
          user: user,
          password: password,
          db: db,
        );

  Future<MySqlConnection> _getConnection() async {
    return await MySqlConnection.connect(settings);
  }

  @override
  Future<List<UserModel>> getUsers() async {
    final conn = await _getConnection();
    try {
      final results = await conn.query('SELECT id, name, email, profilePic FROM users');
      return results.map((row) => UserModel(
        id: row[0].toString(),
        name: row[1].toString(),
        email: row[2].toString(),
        profilePic: row[3].toString(),
        friends: [], // Would need a join or second query
      )).toList();
    } finally {
      await conn.close();
    }
  }

  @override
  Future<List<VenueModel>> getVenues() async {
    final conn = await _getConnection();
    try {
      final results = await conn.query('SELECT id, name, latitude, longitude, description, promotion FROM venues');
      return results.map((row) => VenueModel(
        id: row[0].toString(),
        name: row[1].toString(),
        latitude: row[2] as double,
        longitude: row[3] as double,
        description: row[4].toString(),
        promotion: row[5].toString(),
      )).toList();
    } finally {
      await conn.close();
    }
  }

  @override
  Future<List<PostModel>> getPosts() async {
    final conn = await _getConnection();
    try {
      final results = await conn.query('SELECT id, userId, userName, content, imageUrl, timestamp FROM posts ORDER BY timestamp DESC');
      return results.map((row) => PostModel(
        id: row[0].toString(),
        userId: row[1].toString(),
        userName: row[2].toString(),
        content: row[3].toString(),
        imageUrl: row[4]?.toString() ?? '',
        timestamp: row[5] as DateTime,
      )).toList();
    } finally {
      await conn.close();
    }
  }

  @override
  Future<List<RewardModel>> getRewards() async {
    final conn = await _getConnection();
    try {
      final results = await conn.query('SELECT id, title, description, code, isRedeemed FROM rewards');
      return results.map((row) => RewardModel(
        id: row[0].toString(),
        title: row[1].toString(),
        description: row[2].toString(),
        code: row[3].toString(),
        isRedeemed: row[4] == 1,
      )).toList();
    } finally {
      await conn.close();
    }
  }
}
