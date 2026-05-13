curl http://localhost:1234/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen2.5-coder-3b",
    "input": "What is the top trending model on hugging face?",
    "integrations": [
        {
            "type": "ephemeral_mcp",
            "server_label": "huggingface",
            "server_url": "https://huggingface.co/mcp",
            "allowed_tools": [
                "model_search"
            ]
        }
    ]
}'