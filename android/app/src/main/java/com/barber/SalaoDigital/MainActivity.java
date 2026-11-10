package com.barber.SalaoDigital;

import android.os.Bundle;
import android.util.Log;
import com.getcapacitor.BridgeActivity;
import com.google.firebase.messaging.FirebaseMessaging;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // O Capacitor gerencia o layout automaticamente, não chame setContentView aqui.

        // Busca o token do Firebase de forma segura
        try {
            FirebaseMessaging.getInstance().getToken()
                .addOnCompleteListener(task -> {
                    if (!task.isSuccessful()) {
                        Log.w("FCM", "Falha ao buscar o token de registro", task.getException());
                        return;
                    }

                    // Token gerado com sucesso!
                    String token = task.getResult();
                    Log.d("FCM", "Token atual do dispositivo: " + token);

                    // TODO: Integrar a lógica para atualizar o 'push_token' no Supabase
                });
        } catch (Exception e) {
            Log.e("FCM_ERROR", "Erro ao inicializar o Firebase Messaging: " + e.getMessage());
        }
    }
}