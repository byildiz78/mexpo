import streamlit as st
import requests
import json

def send_push_notification(token, title, message):
    try:
        response = requests.post(
            'https://exp.host/--/api/v2/push/send',
            headers={
                'Content-Type': 'application/json',
            },
            json={
                'to': token,
                'title': title,
                'body': message,
                'sound': 'default',
                'priority': 'high',
            }
        )
        return response.json()
    except Exception as e:
        return {'error': str(e)}

# Session state kullanarak tekrar tekrar göndermeyi engelleyelim
if 'notification_sent' not in st.session_state:
    st.session_state.notification_sent = False

# Streamlit UI
st.title('Expo Push Notification Sender')

# Token input (varsayılan olarak sizin token'ınızı ekledim)
token = st.text_input(
    'Expo Push Token',
    value='ExponentPushToken[bkDbCfOON7igAV2fx8mjYz]'
)

# Bildirim başlığı ve mesajı için input alanları
title = st.text_input('Bildirim Başlığı', value='Test Bildirimi')
message = st.text_area('Bildirim Mesajı', value='Bu bir test bildirimidir.')

# Gönder butonu
if st.button('Bildirim Gönder') and not st.session_state.notification_sent:
    with st.spinner('Bildirim gönderiliyor...'):
        result = send_push_notification(token, title, message)
        
        # Sonucu göster
        st.json(result)
        
        if 'data' in result and result['data'].get('status') == 'ok':
            st.success('Bildirim başarıyla gönderildi!')
            st.session_state.notification_sent = True
        else:
            st.error('Bildirim gönderilemedi!')

# Reset butonu
if st.session_state.notification_sent:
    if st.button('Yeni Bildirim Gönder'):
        st.session_state.notification_sent = False

# Bilgi notu
st.markdown("""
### Nasıl Kullanılır?
1. Token otomatik olarak girilmiştir
2. Bildirim başlığını girin
3. Bildirim mesajını girin
4. 'Bildirim Gönder' butonuna tıklayın
5. Sonucu kontrol edin
6. Yeni bildirim göndermek için 'Yeni Bildirim Gönder' butonuna tıklayın

### Not:
- Token değerini değiştirmek isterseniz üstteki input alanından değiştirebilirsiniz
- Gönderilen bildirimlerin sonuçları JSON formatında gösterilecektir
- Her bildirim için bir kez gönderim yapılır
""")
