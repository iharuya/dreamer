import os
from dotenv import load_dotenv
load_dotenv()
import replicate
replicate.default_client.api_token = os.getenv("REPLICATE_API_TOKEN")
model = replicate.models.get("cjwbw/waifu-diffusion")
output = model.predict(
    prompt="touhou hakurei_reimu 1girl solo portrait",
    width=512,
    height=512,
    seed=123456,
    )

print(output)