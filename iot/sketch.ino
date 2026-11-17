#include <WiFi.h>
#include <PubSubClient.h>

const char* WIFI_SSID = "Wokwi-GUEST";
const char* WIFI_SENHA = "";
const char* MQTT_BROKER = "broker.hivemq.com";
const int MQTT_PORTA = 1883;
const char* TOPICO = "zelabairro/lixeiras/LX-002/nivel";
const char* CODIGO_LIXEIRA = "LX-002";

const int PINO_TRIG = 5;
const int PINO_ECHO = 18;
const int LED_VERDE = 4;
const int LED_AMARELO = 16;
const int LED_VERMELHO = 17;
const int BUZZER = 23;

const unsigned long INTERVALO_ENVIO_MS = 5000;

WiFiClient wifiClient;
PubSubClient mqtt(wifiClient);
unsigned long ultimoEnvio = 0;
bool buzzerLigado = false;

void conectarWiFi() {
  Serial.print("Conectando ao Wi-Fi");
  // O canal 6 é o do Wokwi-GUEST: pular a busca de redes economiza uns 4 segundos
  WiFi.begin(WIFI_SSID, WIFI_SENHA, 6);
  while (WiFi.status() != WL_CONNECTED) {
    delay(250);
    Serial.print(".");
  }
  Serial.println(" conectado!");
}

void conectarMQTT() {
  while (!mqtt.connected()) {
    Serial.print("Conectando ao broker MQTT...");
    // O broker é público: o id precisa ser diferente do de outros usuários
    String clientId = "zelabairro-esp32-" + String(random(0xffff), HEX);
    if (mqtt.connect(clientId.c_str())) {
      Serial.println(" conectado!");
    } else {
      Serial.print(" falhou, codigo ");
      Serial.println(mqtt.state());
      delay(2000);
    }
  }
}

float medirDistanciaCm() {
  digitalWrite(PINO_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PINO_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PINO_TRIG, LOW);

  // Tempo em que o ECHO fica em HIGH, em microssegundos. Retorna 0 se não houver eco em 30 ms
  unsigned long duracao = pulseIn(PINO_ECHO, HIGH, 30000);
  if (duracao == 0) {
    return -1;
  }
  return duracao / 58.0;
}

int calcularNivel(float distanciaCm) {
  // Lixeira simulada com 100 cm de altura: quanto menor a distância, mais cheia
  int nivel = round(100 - distanciaCm);
  return constrain(nivel, 0, 100);
}

void atualizarAlertas(int nivel) {
  digitalWrite(LED_VERDE, LOW);
  digitalWrite(LED_AMARELO, LOW);
  digitalWrite(LED_VERMELHO, LOW);

  if (nivel > 80) {
    digitalWrite(LED_VERMELHO, HIGH);
  } else if (nivel >= 50) {
    digitalWrite(LED_AMARELO, HIGH);
  } else {
    digitalWrite(LED_VERDE, HIGH);
  }

  // Só liga ou desliga o buzzer quando o estado muda, para o som não ficar picotado
  if (nivel > 80 && !buzzerLigado) {
    tone(BUZZER, 1000);
    buzzerLigado = true;
  } else if (nivel <= 80 && buzzerLigado) {
    noTone(BUZZER);
    buzzerLigado = false;
  }
}

void publicarLeitura(float distanciaCm, int nivel) {
  char mensagem[100];
  snprintf(mensagem, sizeof(mensagem),
           "{\"codigoLixeira\":\"%s\",\"distanciaCm\":%.1f,\"nivelPercentual\":%d}",
           CODIGO_LIXEIRA, distanciaCm, nivel);
  mqtt.publish(TOPICO, mensagem);
  Serial.print("Publicado: ");
  Serial.println(mensagem);
}

void setup() {
  Serial.begin(115200);
  pinMode(PINO_TRIG, OUTPUT);
  pinMode(PINO_ECHO, INPUT);
  pinMode(LED_VERDE, OUTPUT);
  pinMode(LED_AMARELO, OUTPUT);
  pinMode(LED_VERMELHO, OUTPUT);
  pinMode(BUZZER, OUTPUT);

  conectarWiFi();
  mqtt.setServer(MQTT_BROKER, MQTT_PORTA);
  conectarMQTT();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    conectarWiFi();
  }
  if (!mqtt.connected()) {
    conectarMQTT();
  }
  mqtt.loop();

  float distancia = medirDistanciaCm();
  if (distancia < 0) {
    Serial.println("Sem leitura do sensor");
    delay(500);
    return;
  }

  int nivel = calcularNivel(distancia);
  atualizarAlertas(nivel);

  if (millis() - ultimoEnvio >= INTERVALO_ENVIO_MS) {
    publicarLeitura(distancia, nivel);
    ultimoEnvio = millis();
  }

  delay(200);
}
