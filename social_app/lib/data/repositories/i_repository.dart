import '../models/post_model.dart';
import '../models/reward_model.dart';
import '../models/user_model.dart';
import '../models/venue_model.dart';

abstract class IRepository {
  Future<List<UserModel>> getUsers();
  Future<List<VenueModel>> getVenues();
  Future<List<PostModel>> getPosts();
  Future<List<RewardModel>> getRewards();
}
