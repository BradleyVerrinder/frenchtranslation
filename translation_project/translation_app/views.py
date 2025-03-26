from django.shortcuts import render
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
def translate_word(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            word = data.get("word", "")

            if not word:
                return JsonResponse({"error": "No word provided"}, status=400)

            logger.info(f"Translating word: {word}")

            # MyMemory API for French to English translation
            url = "https://api.mymemory.translated.net/get"
            params = {"q": word, "langpair": "fr|en"}
            response = requests.get(url, params=params)
            response.raise_for_status()

            translation_data = response.json()

            # Log full response to debug issues
            logger.info(f"MyMemory API Response: {json.dumps(translation_data, indent=2)}")

            # Extract translated text
            translated_text = translation_data.get("responseData", {}).get("translatedText", "")

            if not translated_text:
                return JsonResponse({"error": "Translation not found"}, status=500)

            return JsonResponse({"translatedText": translated_text})

        except requests.exceptions.RequestException as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)