class UserModel {
  final String id;
  final String name;
  final String email;
  final String profilePic;
  final List<String> friends;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.profilePic,
    required this.friends,
  });

  factory UserModel.fromMap(Map<String, dynamic> data, String id) {
    return UserModel(
      id: id,
      name: data['name'] ?? '',
      email: data['email'] ?? '',
      profilePic: data['profilePic'] ?? '',
      friends: List<String>.from(data['friends'] ?? []),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'email': email,
      'profilePic': profilePic,
      'friends': friends,
    };
  }
}
