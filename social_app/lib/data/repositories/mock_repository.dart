import '../models/post_model.dart';
import '../models/reward_model.dart';
import '../models/venue_model.dart';
import '../models/user_model.dart';
import 'i_repository.dart';

class MockRepository implements IRepository {
  @override
  Future<List<UserModel>> getUsers() async => getMockUsers();

  @override
  Future<List<VenueModel>> getVenues() async => getMockVenues();

  @override
  Future<List<PostModel>> getPosts() async => getMockPosts();

  @override
  Future<List<RewardModel>> getRewards() async => getMockRewards();

  static List<UserModel> getMockUsers() {
    return [
      UserModel(
        id: 'u1',
        name: 'Alex Rivera',
        email: 'alex@example.com',
        profilePic: 'https://i.pravatar.cc/150?u=u1',
        friends: ['u2', 'u3'],
      ),
      UserModel(
        id: 'u2',
        name: 'Sofia Chen',
        email: 'sofia@example.com',
        profilePic: 'https://i.pravatar.cc/150?u=u2',
        friends: ['u1', 'u4'],
      ),
      UserModel(
        id: 'u3',
        name: 'Jordan Smith',
        email: 'jordan@example.com',
        profilePic: 'https://i.pravatar.cc/150?u=u3',
        friends: ['u1'],
      ),
      UserModel(
        id: 'u4',
        name: 'Elena Rodriguez',
        email: 'elena@example.com',
        profilePic: 'https://i.pravatar.cc/150?u=u4',
        friends: ['u2'],
      ),
    ];
  }

  static List<VenueModel> getMockVenues() {
    return [
      VenueModel(
        id: 'v1',
        name: 'Club Cyber',
        latitude: 40.7128,
        longitude: -74.0060,
        description: 'The ultimate neon experience with futuristic beats.',
        promotion: 'Happy Hour: 2x1 on Signature Neon Cocktails until 11 PM!',
      ),
      VenueModel(
        id: 'v2',
        name: 'The Velvet Lounge',
        latitude: 40.7135,
        longitude: -74.0050,
        description: 'Sophisticated jazz and premium spirits in a relaxed atmosphere.',
        promotion: 'Complimentary welcome shot for groups of 4 or more.',
      ),
      VenueModel(
        id: 'v3',
        name: 'Retro Arcade Bar',
        latitude: 40.7115,
        longitude: -74.0075,
        description: 'Classic 80s games paired with modern craft beers.',
        promotion: 'Get 50 free tokens with your first pitcher of beer.',
      ),
      VenueModel(
        id: 'v4',
        name: 'Skyline Terrace',
        latitude: 40.7150,
        longitude: -74.0030,
        description: 'Breathtaking city views and rooftop party vibes.',
        promotion: 'Ladies Night: Free entry and glass of prosecco before midnight.',
      ),
    ];
  }

  static List<PostModel> getMockPosts() {
    final users = getMockUsers();
    final venues = getMockVenues();

    return [
      PostModel(
        id: 'p1',
        userId: 'u1',
        userName: 'Alex Rivera',
        content: 'Just arrived at ${venues[0].name}. The music is insane tonight! 🚀 #CyberVibes',
        imageUrl: 'https://images.unsplash.com/photo-1514525253361-bee8718a74a2?w=800&q=80',
        timestamp: DateTime.now().subtract(const Duration(minutes: 10)),
      ),
      PostModel(
        id: 'p2',
        userId: 'u2',
        userName: 'Sofia Chen',
        content: 'Enjoying a quiet drink at ${venues[1].name}. Perfect spot for a Saturday night.',
        imageUrl: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?w=800&q=80',
        timestamp: DateTime.now().subtract(const Duration(minutes: 25)),
      ),
      PostModel(
        id: 'p3',
        userId: 'u3',
        userName: 'Jordan Smith',
        content: 'Beating high scores at ${venues[2].name}! Who wants to challenge me?',
        imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80',
        timestamp: DateTime.now().subtract(const Duration(hours: 1)),
      ),
      PostModel(
        id: 'p4',
        userId: 'u4',
        userName: 'Elena Rodriguez',
        content: 'The view from ${venues[3].name} is absolutely stunning. ✨',
        imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
        timestamp: DateTime.now().subtract(const Duration(hours: 2)),
      ),
    ];
  }

  static List<RewardModel> getMockRewards() {
    return [
      RewardModel(
        id: 'r1',
        title: '2x1 Neon Cocktails',
        description: 'Exclusive for popular users at Club Cyber.',
        code: 'CYBER2X1',
        isRedeemed: false,
      ),
      RewardModel(
        id: 'r2',
        title: 'VIP Lounge Access',
        description: 'Redeem for access to the private lounge at The Velvet Lounge.',
        code: 'VELVETVIP',
        isRedeemed: false,
      ),
      RewardModel(
        id: 'r3',
        title: 'Arcade Master Pack',
        description: '100 free tokens at Retro Arcade Bar.',
        code: 'ARCADE100',
        isRedeemed: true,
      ),
      RewardModel(
        id: 'r4',
        title: 'Skyline Bottle Service',
        description: '20% off bottle service for your birthday at Skyline Terrace.',
        code: 'SKYBDAY',
        isRedeemed: false,
      ),
    ];
  }
}
