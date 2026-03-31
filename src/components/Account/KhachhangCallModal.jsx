import Color from "@components/common/Color"
import PropTypes from "prop-types"

export default function KhachhangCallModal({
  visible,
  hotlineText,
  onConfirmCall,
  onCancel,
}) {
  if (!visible) return null

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.45)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 360,
          background: "#fff",
          borderRadius: 22,
          padding: 14,
        }}
      >
        <button
          type="button"
          onClick={onConfirmCall}
          style={{
            width: "100%",
            height: 52,
            border: "none",
            borderRadius: 28,
            background: Color.primary,
            color: "#fff",
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 10,
            cursor: "pointer",
          }}
        >
          Gọi {hotlineText}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            width: "100%",
            height: 52,
            border: "none",
            borderRadius: 28,
            background: "#e9edf2",
            color: "#1f2937",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Hủy
        </button>
      </div>
    </div>
  )
}

KhachhangCallModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  hotlineText: PropTypes.string.isRequired,
  onConfirmCall: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}
