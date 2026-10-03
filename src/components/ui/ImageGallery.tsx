import {
  Animated,
  PanResponder,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import { useEffect, useRef, useState } from "react";

type ImageGalleryProps = {
  images: string[];

  onGestureStart?: () => void;
  onGestureEnd?: () => void;
};

export function ImageGallery({
  images,
  onGestureStart,
  onGestureEnd,
}: ImageGalleryProps) {
  const { width } = useWindowDimensions();

  /*
   * Native driver web'de desteklenmiyor.
   */
  const useNativeDriver = Platform.OS !== "web";

  /*
   * Aktif resim.
   */
  const [imageIndex, setImageIndex] = useState(0);

  /*
   * Resmin yalnızca X eksenindeki konumu.
   */
  const imageXPosition = useRef(new Animated.Value(0)).current;

  /*
   * PanResponder bir kere oluşturulduğu için
   * güncel değerleri ref üzerinden okuyoruz.
   */
  const widthRef = useRef(width);

  widthRef.current = width;

  const imageIndexRef = useRef(imageIndex);

  imageIndexRef.current = imageIndex;

  const imagesRef = useRef(images);

  imagesRef.current = images;

  const onGestureStartRef = useRef(onGestureStart);

  onGestureStartRef.current = onGestureStart;

  const onGestureEndRef = useRef(onGestureEnd);

  onGestureEndRef.current = onGestureEnd;

  /*
   * Yeni resmin hangi taraftan
   * gireceğini saklıyoruz.
   */
  const pendingEntryPosition = useRef<number | null>(null);

  function resetImagePosition() {
    Animated.spring(imageXPosition, {
      toValue: 0,
      useNativeDriver,
    }).start();
  }

  function finishGesture() {
    onGestureEndRef.current?.();
  }

  const panResponder = useRef(
    PanResponder.create({
      /*
       * Image alanına dokunulduğu anda
       * gesture'ı ImageGallery sahiplenir.
       */
      onStartShouldSetPanResponder: () => true,

      onStartShouldSetPanResponderCapture: () => true,

      onMoveShouldSetPanResponder: () => true,

      onMoveShouldSetPanResponderCapture: () => true,

      /*
       * Gesture başladığı anda Detail
       * ekranındaki ScrollView kapatılır.
       */
      onPanResponderGrant: () => {
        imageXPosition.stopAnimation();

        onGestureStartRef.current?.();
      },

      /*
       * DİKKAT:
       * Burada yalnızca dx kullanılıyor.
       *
       * dy hiçbir şekilde image konumuna
       * uygulanmıyor.
       *
       * Dolayısıyla resim yalnızca
       * sağa / sola hareket eder.
       */
      onPanResponderMove: (_event, gestureState) => {
        imageXPosition.setValue(gestureState.dx);
      },

      onPanResponderRelease: (_event, gestureState) => {
        const currentWidth = widthRef.current;

        const threshold = currentWidth * 0.4;

        const shouldSwipe = Math.abs(gestureState.dx) >= threshold;

        /*
         * Yeterli yatay hareket yok.
         *
         * Örneğin kullanıcı sadece
         * aşağı doğru sürüklediyse:
         *
         * dx ≈ 0
         * dy büyük
         *
         * image hiçbir yere gitmez.
         */
        if (!shouldSwipe) {
          resetImagePosition();
          finishGesture();
          return;
        }

        /*
         * Sol:
         * direction = -1
         *
         * Sağ:
         * direction = +1
         */
        const direction = Math.sign(gestureState.dx);

        /*
         * Gesture yönü ile image index
         * yönü ters.
         */
        const indexDirection = -direction;

        const currentIndex = imageIndexRef.current;

        const nextIndex = currentIndex + indexDirection;

        const isOutOfBounds =
          nextIndex < 0 || nextIndex >= imagesRef.current.length;

        /*
         * İlk veya son resmin
         * dışına çıkılmaya çalışılıyor.
         */
        if (isOutOfBounds) {
          resetImagePosition();
          finishGesture();
          return;
        }

        /*
         * Mevcut resmi ekran dışına çıkar.
         */
        Animated.timing(imageXPosition, {
          toValue: direction * currentWidth,

          duration: 250,

          useNativeDriver,
        }).start(({ finished }) => {
          finishGesture();

          if (!finished) {
            return;
          }

          /*
           * Yeni resim karşı taraftan
           * gelecek.
           */
          pendingEntryPosition.current = -direction * currentWidth;

          setImageIndex(nextIndex);
        });
      },

      /*
       * Gesture iptal edilirse
       * resmi merkeze getir ve
       * parent ScrollView'ı tekrar aç.
       */
      onPanResponderTerminate: () => {
        resetImagePosition();
        finishGesture();
      },

      /*
       * Gesture devam ederken parent'ın
       * responder'ı devralmasını istemiyoruz.
       */
      onPanResponderTerminationRequest: () => false,

      /*
       * Android native component'lerin
       * gesture'ı devralmasını engeller.
       */
      onShouldBlockNativeResponder: () => true,
    }),
  ).current;

  /*
   * imageIndex değişince yeni resmi
   * karşı taraftan merkeze getir.
   */
  useEffect(() => {
    const startPosition = pendingEntryPosition.current;

    if (startPosition === null) {
      return;
    }

    imageXPosition.setValue(startPosition);

    pendingEntryPosition.current = null;

    Animated.spring(imageXPosition, {
      toValue: 0,
      useNativeDriver,
    }).start();
  }, [imageIndex, imageXPosition, useNativeDriver]);

  /*
   * images değişirse index geçerli
   * aralıkta kalsın.
   */
  useEffect(() => {
    if (images.length === 0) {
      setImageIndex(0);
      imageIndexRef.current = 0;
      return;
    }

    if (imageIndex >= images.length) {
      const newIndex = images.length - 1;

      setImageIndex(newIndex);

      imageIndexRef.current = newIndex;

      imageXPosition.setValue(0);
    }
  }, [images, imageIndex, imageXPosition]);

  /*
   * Component kaldırılırken animasyonu
   * ve gesture kilidini temizle.
   */
  useEffect(() => {
    return () => {
      imageXPosition.stopAnimation();

      onGestureEndRef.current?.();
    };
  }, [imageXPosition]);

  if (images.length === 0) {
    return null;
  }

  return (
    <View
      {...panResponder.panHandlers}
      style={[
        styles.container,

        {
          width,
        },

        /*
         * Web'de browser'ın image alanındaki
         * native pan/scroll davranışını
         * engelliyoruz.
         */
        Platform.OS === "web"
          ? ({
              touchAction: "none",
              userSelect: "none",
            } as any)
          : null,
      ]}
    >
      <Animated.Image
        source={{
          uri: images[imageIndex],
        }}
        resizeMode="cover"
        style={[
          styles.image,
          {
            width,

            /*
             * Yalnızca yatay transform var.
             * translateY YOK.
             */
            transform: [
              {
                translateX: imageXPosition,
              },
            ],
          },
        ]}
      />

      <View pointerEvents="none" style={styles.indicatorContainer}>
        {images.map((_image, index) => (
          <View
            key={index}
            style={[
              styles.indicator,

              index === imageIndex && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",

    height: 300,

    overflow: "hidden",
  },

  image: {
    height: 300,
  },

  indicatorContainer: {
    position: "absolute",

    left: 0,
    right: 0,
    bottom: 12,

    flexDirection: "row",

    justifyContent: "center",

    gap: 6,
  },

  indicator: {
    width: 7,
    height: 7,

    borderRadius: 999,

    backgroundColor: "rgba(255,255,255,0.45)",
  },

  activeIndicator: {
    width: 18,

    backgroundColor: "rgba(255,255,255,0.95)",
  },
});
