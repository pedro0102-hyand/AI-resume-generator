"""
Script para testar modelos Gemini com a API estável
Execute: python test_api_stable.py
"""
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# Configura a API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

print("🔍 Testando Google Generative AI (API estável)...\n")
print("=" * 60)

# Lista de modelos para testar
test_models = [
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-1.0-pro',
    'gemini-pro',
]

for model_name in test_models:
    try:
        print(f"\n🧪 Testando: {model_name}")
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Say hello in one word")
        
        print(f"✅ FUNCIONA: {model_name}")
        print(f"   Resposta: {response.text[:50]}")
        print("   " + "=" * 56)
        
    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
            print(f"⚠️  RATE LIMIT: {model_name}")
            print(f"   Aguarde alguns minutos e tente novamente")
        elif "404" in error_msg or "not found" in error_msg.lower():
            print(f"❌ NÃO EXISTE: {model_name}")
        else:
            print(f"❌ ERRO: {model_name}")
            print(f"   {error_msg[:80]}")
        print("   " + "=" * 56)

print("\n" + "=" * 60)
print("✨ Teste concluído!")