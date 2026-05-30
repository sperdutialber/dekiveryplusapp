class RewardModel {
  final String id;
  final String title;
  final String description;
  final String code;
  final bool isRedeemed;

  RewardModel({
    required this.id,
    required this.title,
    required this.description,
    required this.code,
    required this.isRedeemed,
  });

  factory RewardModel.fromMap(Map<String, dynamic> data, String id) {
    return RewardModel(
      id: id,
      title: data['title'] ?? '',
      description: data['description'] ?? '',
      code: data['code'] ?? '',
      isRedeemed: data['isRedeemed'] ?? false,
    );
  }
}
