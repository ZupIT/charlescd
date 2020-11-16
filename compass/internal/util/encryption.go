package util

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
)

func Encrypt(plainJson json.RawMessage, key string) (ciphertext string, err error) {
	plaintext, err := jsonToString(plainJson)
	if err != nil {
		fmt.Println("fudeu")
	}

	//prepare cipher
	keyByte := []byte(key)
	block, err := aes.NewCipher(keyByte)
	if err != nil {
		panic(err.Error())
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}
	nonce := make([]byte, gcm.NonceSize())
	_, err = io.ReadFull(rand.Reader, nonce)
	if err != nil {
		return "", err
	}

	ciphertextByte := gcm.Seal(
		nonce,
		nonce,
		[]byte(plaintext),
		nil)
	ciphertext = base64.StdEncoding.EncodeToString(ciphertextByte)

	return ciphertext, nil
}

func Decrypt(cipherJson json.RawMessage, key string) (plainText []byte, err error) {
	cipherText := unmarshallEncryptedJson(cipherJson)

	// prepare cipher
	keyByte := []byte(key)
	block, err := aes.NewCipher(keyByte)
	if err != nil {
		return
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return
	}
	nonceSize := gcm.NonceSize()
	//

	// process ciphertext
	ciphertextByte, _ := base64.StdEncoding.DecodeString(cipherText)
	nonce, ciphertextByteClean := ciphertextByte[:nonceSize], ciphertextByte[nonceSize:]
	plaintextByte, err := gcm.Open(
		nil,
		nonce,
		ciphertextByteClean,
		nil)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	//
	return plaintextByte, nil
}

func unmarshallEncryptedJson(message json.RawMessage) string {
	var jsonDecrypted map[string]string
	_ = json.Unmarshal(message, &jsonDecrypted)

	return jsonDecrypted["data"]
}

func jsonToString(message json.RawMessage) (string, error) {
	dataByte, err := message.MarshalJSON()
	if err != nil {
		fmt.Println("fudeu")
		return "", err
	}

	return string(dataByte), nil
}
